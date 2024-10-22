const fs = require('fs');
const { Parser } = require('json2csv');
const pool = require('./database');

async function exportDataToCSV() {
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

    // Execute queries and write results to CSV
    for (const [tableName, query] of Object.entries(queries)) {
      const result = await client.query(query);
      if (result.rows.length === 0) {
        console.log(`No data found for ${tableName}. Skipping CSV export.`);
        continue;
      }
      const parser = new Parser();
      const csv = parser.parse(result.rows);
      
      fs.writeFileSync(`${tableName}.csv`, csv);
      console.log(`Exported ${tableName} to ${tableName}.csv`);
    }

    client.release();
    console.log('Data export complete');
  } catch (err) {
    console.error('Error exporting data:', err);
  }
}

exportDataToCSV().catch(console.error);
