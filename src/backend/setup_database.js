const path = require('path');
require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const csv = require('csv-parser');

const dbUrl = process.env.DATABASE_URL;
const csvFilePath = path.join(__dirname, 'data.csv');

if (!dbUrl) {
  console.error('DATABASE_URL is not set. Please check your Heroku config vars.');
  process.exit(1);
}

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
  age_group VARCHAR(10) CHECK (age_group IN ('0-19', '20-29', '30-39', '40-49', '50-59', '60+')),
  gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  has_diabetes VARCHAR(20) CHECK (has_diabetes IN ('yes', 'no', 'prefer_not_to_say')),
  is_healthcare_personnel BOOLEAN,
  healthcare_professional_type VARCHAR(50),
  education_level VARCHAR(50),
  previous_participation BOOLEAN
);

CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  end_time TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS ratings (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES sessions(id),
  answer_id INTEGER REFERENCES answers(id),
  knowledge INTEGER,
  helpfulness INTEGER,
  empathy INTEGER,
  response_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_feedback (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES sessions(id),
  feedback TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dashboard_stats (
  id SERIAL PRIMARY KEY,
  total_responses INTEGER DEFAULT 0,
  avg_response_time FLOAT DEFAULT 0,
  avg_knowledge FLOAT DEFAULT 0,
  avg_helpfulness FLOAT DEFAULT 0,
  avg_empathy FLOAT DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;

async function setupDatabase() {
  console.log('Attempting to connect to database with URL:', dbUrl);
  
  const client = new Client({
    connectionString: dbUrl,
    ssl: {
      rejectUnauthorized: false
    },
    timezone: 'Europe/Berlin'
  });

  try {
    await client.connect();
    console.log('Connected to the database');

    // Set the time zone for the database session
    await client.query("SET timezone TO 'Europe/Berlin';");
    console.log('Time zone set to Europe/Berlin');

    // Create tables
    await client.query(createTablesSQL);
    console.log('Tables created successfully.');

    // Check if data already exists
    const existingData = await client.query('SELECT COUNT(*) FROM questions');
    if (parseInt(existingData.rows[0].count) > 0) {
      console.log('Data already exists in the database. Skipping import.');
      return;
    }

    // Check if CSV file exists
    if (!fs.existsSync(csvFilePath)) {
      console.error(`CSV file not found: ${csvFilePath}`);
      return;
    }

    // Import data from CSV
    const records = await new Promise((resolve, reject) => {
      const data = [];
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => data.push(row))
        .on('end', () => resolve(data))
        .on('error', reject);
    });

    for (const record of records) {
      const { question, answer_human, answer_llm } = record;

      // Insert question
      const questionResult = await client.query(
        'INSERT INTO questions (question_text) VALUES ($1) RETURNING id',
        [question]
      );
      const questionId = questionResult.rows[0].id;

      // Insert human answer
      await client.query(
        'INSERT INTO answers (question_id, answer_text, source) VALUES ($1, $2, $3)',
        [questionId, answer_human, 'human']
      );

      // Insert LLM answer if it's not 'N/A'
      if (answer_llm && answer_llm !== 'N/A') {
        await client.query(
          'INSERT INTO answers (question_id, answer_text, source) VALUES ($1, $2, $3)',
          [questionId, answer_llm, 'llm']
        );
      }
    }
    console.log('Data imported successfully.');
  } catch (err) {
    console.error('Error setting up database:', err);
  } finally {
    await client.end();
  }
}

setupDatabase().then(() => console.log('Setup complete')).catch(console.error);