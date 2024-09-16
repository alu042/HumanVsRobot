const express = require('express');
const router = express.Router();
const pool = require('./database');
const { insertUser, insertRating } = require('./models');

// Middleware to parse JSON bodies
router.use(express.json());

// User creation route
router.post('/users', async (req, res) => {
  const { ageGroup, gender } = req.body;
  try {
    const user = await insertUser(ageGroup, gender, null);
    res.json({ userId: user.user_id });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get questions with answers
router.get('/questions', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT q.id AS question_id, q.question_text,
             json_agg(
               json_build_object(
                 'answer_id', a.id,
                 'answer_text', a.answer_text,
                 'source', a.source
               ) ORDER BY a.id
             ) AS answers
      FROM questions q
      JOIN answers a ON a.question_id = q.id
      GROUP BY q.id
      ORDER BY q.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Store user ratings and comments
router.post('/ratings', async (req, res) => {
  const { userId, responses } = req.body;
  console.log('Received userId:', userId);
  console.log('Received responses:', JSON.stringify(responses, null, 2));
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const response of responses) {
      const questionId = response.questionId;
      for (const rating of response.ratings) {
        const { answerId, criteria, comments } = rating;
        await insertRating(
          userId,
          answerId,
          criteria.Knowledge,
          criteria.Helpfulness,
          criteria.Empathy,
          comments
        );
      }
    }
    await client.query('COMMIT');
    res.json({ message: 'Ratings saved successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error storing ratings:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

module.exports = router;