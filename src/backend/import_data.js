const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const pool = require('./database');

const csvFilePath = path.join(__dirname, 'data.csv'); // Adjust the path if necessary

const importData = async () => {
  const questionsMap = new Map(); // To keep track of inserted questions
  const records = [];

  // Read CSV file
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      records.push(row);
    })
    .on('end', async () => {
      console.log('CSV file successfully processed');
      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        for (const record of records) {
          const questionText = record['question'];
          const answerHuman = record['answer_human'];
          const answerLLM = record['answer_llm'];

          let questionId;
          if (questionsMap.has(questionText)) {
            questionId = questionsMap.get(questionText);
          } else {
            // Insert question
            const questionResult = await client.query(
              'INSERT INTO questions (question_text) VALUES ($1) RETURNING id',
              [questionText]
            );
            questionId = questionResult.rows[0].id;
            questionsMap.set(questionText, questionId);
          }

          // Insert human answer
          await client.query(
            'INSERT INTO answers (question_id, answer_text, source) VALUES ($1, $2, $3)',
            [questionId, answerHuman, 'human']
          );

          // Insert LLM answer
          await client.query(
            'INSERT INTO answers (question_id, answer_text, source) VALUES ($1, $2, $3)',
            [questionId, answerLLM, 'llm']
          );
        }

        await client.query('COMMIT');
        console.log('Data imported successfully');
      } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error importing data:', error);
      } finally {
        client.release();
      }
    });
};

importData();