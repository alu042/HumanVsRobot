const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { createObjectCsvWriter } = require('csv-writer');

// Database connection configuration
const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'your_database_name',
  password: 'your_password',
  port: 5432,
});

async function exportSurveyData() {
  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT 
        u.id as user_id,
        q.question,
        q.answer1,
        q.answer2,
        r.knowledge_rating1,
        r.helpfulness_rating1,
        r.empathy_rating1,
        r.knowledge_rating2,
        r.helpfulness_rating2,
        r.empathy_rating2,
        r.comments
      FROM 
        users u
      JOIN 
        ratings r ON u.id = r.user_id
      JOIN 
        questions q ON r.question_id = q.id
      ORDER BY 
        u.id, q.id
    `);
    client.release();

    const timestamp = new Date().toISOString().replace(/[:.]/g, '_').slice(0, -5);
    const exportDir = path.join(__dirname, '..', '..', 'exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
    }
    const filePath = path.join(exportDir, `survey_data_${timestamp}.csv`);

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'user_id', title: 'User ID' },
        { id: 'question', title: 'Question' },
        { id: 'answer1', title: 'Answer 1' },
        { id: 'answer2', title: 'Answer 2' },
        { id: 'knowledge_rating1', title: 'Knowledge Rating (Answer 1)' },
        { id: 'helpfulness_rating1', title: 'Helpfulness Rating (Answer 1)' },
        { id: 'empathy_rating1', title: 'Empathy Rating (Answer 1)' },
        { id: 'knowledge_rating2', title: 'Knowledge Rating (Answer 2)' },
        { id: 'helpfulness_rating2', title: 'Helpfulness Rating (Answer 2)' },
        { id: 'empathy_rating2', title: 'Empathy Rating (Answer 2)' },
        { id: 'comments', title: 'User Comments' },
      ],
    });

    await csvWriter.writeRecords(result.rows);
    console.log(`Survey data exported successfully to ${filePath}`);
  } catch (error) {
    console.error('Error exporting survey data:', error);
  } finally {
    await pool.end();
  }
}

exportSurveyData();
