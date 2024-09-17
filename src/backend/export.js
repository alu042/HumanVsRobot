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
        s.id as session_id,
        q.question_text as question,
        a1.answer_text as answer1,
        a2.answer_text as answer2,
        r1.knowledge as knowledge_rating1,
        r1.helpfulness as helpfulness_rating1,
        r1.empathy as empathy_rating1,
        r1.response_time as response_time1,
        r2.knowledge as knowledge_rating2,
        r2.helpfulness as helpfulness_rating2,
        r2.empathy as empathy_rating2,
        r2.response_time as response_time2,
        uf.feedback as comments
      FROM 
        users u
        JOIN sessions s ON u.id = s.user_id
        JOIN ratings r1 ON s.id = r1.session_id
        JOIN answers a1 ON r1.answer_id = a1.id
        JOIN questions q ON a1.question_id = q.id
        LEFT JOIN ratings r2 ON s.id = r2.session_id AND r2.answer_id != r1.answer_id AND r2.answer_id IN (SELECT id FROM answers WHERE question_id = q.id)
        LEFT JOIN answers a2 ON r2.answer_id = a2.id
        LEFT JOIN user_feedback uf ON s.id = uf.session_id
      ORDER BY 
        u.id, q.id, a1.id
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
        { id: 'session_id', title: 'Session ID' },
        { id: 'question', title: 'Question' },
        { id: 'answer1', title: 'Answer 1' },
        { id: 'answer2', title: 'Answer 2' },
        { id: 'knowledge_rating1', title: 'Knowledge Rating (Answer 1)' },
        { id: 'helpfulness_rating1', title: 'Helpfulness Rating (Answer 1)' },
        { id: 'empathy_rating1', title: 'Empathy Rating (Answer 1)' },
        { id: 'response_time1', title: 'Response Time (Answer 1)' },
        { id: 'knowledge_rating2', title: 'Knowledge Rating (Answer 2)' },
        { id: 'helpfulness_rating2', title: 'Helpfulness Rating (Answer 2)' },
        { id: 'empathy_rating2', title: 'Empathy Rating (Answer 2)' },
        { id: 'response_time2', title: 'Response Time (Answer 2)' },
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
