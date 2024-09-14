const express = require('express');
const { pool, sanitizeInput, encryptData, decryptData } = require('./database');
const { insertUser, insertQuestion, insertAnswer, insertRating } = require('./models');

const router = express.Router();

// Fetching questions and answers
router.get('/questions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM questions');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/answers/:questionId', async (req, res) => {
  const { questionId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM answers WHERE question_id = $1', [questionId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching answers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Storing user ratings and comments
router.post('/ratings', async (req, res) => {
  const { userId, answerId, accuracy, comprehensiveness, clarity, comments } = req.body;
  try {
    const sanitizedComments = sanitizeInput(comments);
    const result = await insertRating(userId, answerId, accuracy, comprehensiveness, clarity, sanitizedComments);
    res.json(result);
  } catch (error) {
    console.error('Error storing rating:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Retrieving aggregated data for analysis
router.get('/aggregated-data', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT answer_id, AVG(accuracy) AS avg_accuracy, AVG(comprehensiveness) AS avg_comprehensiveness, AVG(clarity) AS avg_clarity
      FROM ratings
      GROUP BY answer_id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving aggregated data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
