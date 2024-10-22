const fs = require('fs');
const { Parser } = require('json2csv');
const pool = require('./database');

async function exportData() {
  try {
    // Connect to the database
    const client = await pool.connect();

    // Define your SQL queries
    const queries = {
      questions: 'SELECT * FROM questions',
      answers: 'SELECT * FROM answers',
      users: 'SELECT * FROM users',
      sessions: 'SELECT * FROM sessions',
      ratings: 'SELECT * FROM ratings',
      user_feedback: 'SELECT * FROM user_feedback',
      dashboard_stats: 'SELECT * FROM dashboard_stats'
    };

    const exportedData = {};

    // Execute queries and store results
    for (const [tableName, query] of Object.entries(queries)) {
      const result = await client.query(query);
      if (result.rows.length === 0) {
        console.log(`No data found for ${tableName}. Skipping export.`);
        continue;
      }
      exportedData[tableName] = result.rows;
      console.log(`Exported ${tableName} data`);
    }

    client.release();
    console.log('Data export complete');
    return exportedData;
  } catch (err) {
    console.error('Error exporting data:', err);
    throw err;
  }
}

exportData()
  .then(data => console.log(JSON.stringify(data, null, 2)))
  .catch(console.error);
