const { pool } = require('./database');
const fs = require('fs');
const csv = require('csv-parser');

// Create tables to store user information, questions and answers, ratings, and additional comments
const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        age_group VARCHAR(50),
        gender VARCHAR(50),
        demographic_data JSONB
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        question_text TEXT
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS answers (
        id SERIAL PRIMARY KEY,
        question_id INTEGER REFERENCES questions(id),
        answer_text TEXT
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        answer_id INTEGER REFERENCES answers(id),
        accuracy INTEGER,
        comprehensiveness INTEGER,
        clarity INTEGER,
        comments TEXT
      );
    `);

    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

// Define the data structure for each table
const insertUser = async (age_group, gender, demographic_data) => {
  try {
    const result = await pool.query(
      'INSERT INTO users (age_group, gender, demographic_data) VALUES ($1, $2, $3) RETURNING *',
      [age_group, gender, demographic_data]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error inserting user:', error);
  }
};

const insertQuestion = async (question_text) => {
  try {
    const result = await pool.query(
      'INSERT INTO questions (question_text) VALUES ($1) RETURNING *',
      [question_text]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error inserting question:', error);
  }
};

const insertAnswer = async (question_id, answer_text) => {
  try {
    const result = await pool.query(
      'INSERT INTO answers (question_id, answer_text) VALUES ($1, $2) RETURNING *',
      [question_id, answer_text]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error inserting answer:', error);
  }
};

const insertRating = async (user_id, answer_id, accuracy, comprehensiveness, clarity, comments) => {
  try {
    const result = await pool.query(
      'INSERT INTO ratings (user_id, answer_id, accuracy, comprehensiveness, clarity, comments) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [user_id, answer_id, accuracy, comprehensiveness, clarity, comments]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error inserting rating:', error);
  }
};

// Add functionality to read questions and answers from a CSV file with headers "question", "answer1", "answer2"
const importQuestionsFromCSV = async (csvFilePath) => {
  const questions = [];
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      questions.push(row);
    })
    .on('end', async () => {
      for (const question of questions) {
        const insertedQuestion = await insertQuestion(question.question);
        await insertAnswer(insertedQuestion.id, question.answer1);
        await insertAnswer(insertedQuestion.id, question.answer2);
      }
      console.log('Questions and answers imported successfully');
    });
};

module.exports = {
  createTables,
  insertUser,
  insertQuestion,
  insertAnswer,
  insertRating,
  importQuestionsFromCSV,
};
