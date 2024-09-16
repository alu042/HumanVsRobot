const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { Client } = require('pg');
const fs = require('fs');
const csv = require('csv-parser');

const dbName = process.env.DB_NAME || 'humanvsrobot';
const csvFilePath = path.join(__dirname, 'data.csv');

const createTablesSQL = `
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  question_text TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS answers (
  id SERIAL PRIMARY KEY,
  question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer_text TEXT NOT NULL,
  source VARCHAR(10) NOT NULL CHECK (source IN ('human', 'llm'))
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  age_group VARCHAR(10),
  gender VARCHAR(20),
  demographic_data TEXT
);

CREATE TABLE IF NOT EXISTS user_feedback (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  feedback TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ratings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  answer_id INTEGER REFERENCES answers(id),
  knowledge INTEGER,
  helpfulness INTEGER,
  empathy INTEGER
);
`;

async function setupDatabase() {
  // Connect to PostgreSQL
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
  });

  try {
    await client.connect();

    // Create database if it doesn't exist
    await client.query(`CREATE DATABASE ${dbName}`);
    console.log(`Database ${dbName} created or already exists.`);
  } catch (err) {
    if (err.code === '42P04') {
      console.log(`Database ${dbName} already exists.`);
    } else {
      console.error('Error creating database:', err);
      process.exit(1);
    }
  } finally {
    await client.end();
  }

  // Connect to the new database
  const dbClient = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST || 'localhost',
    database: dbName,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
  });

  try {
    await dbClient.connect();

    // Create tables
    await dbClient.query(createTablesSQL);
    console.log('Tables created successfully.');

    // Import data from CSV
    const records = [];
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (data) => records.push(data))
      .on('end', async () => {
        for (const record of records) {
          const { question, answer_human, answer_llm } = record;

          // Insert question
          const questionResult = await dbClient.query(
            'INSERT INTO questions (question_text) VALUES ($1) RETURNING id',
            [question]
          );
          const questionId = questionResult.rows[0].id;

          // Insert human answer
          await dbClient.query(
            'INSERT INTO answers (question_id, answer_text, source) VALUES ($1, $2, $3)',
            [questionId, answer_human, 'human']
          );

          // Insert LLM answer
          await dbClient.query(
            'INSERT INTO answers (question_id, answer_text, source) VALUES ($1, $2, $3)',
            [questionId, answer_llm, 'llm']
          );
        }
        console.log('Data imported successfully.');
        await dbClient.end();
      });
  } catch (err) {
    console.error('Error setting up database:', err);
  }
}

setupDatabase();