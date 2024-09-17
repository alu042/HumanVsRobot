const express = require('express');
const router = express.Router();
const pool = require('./database');
const { insertUser, insertRating, insertUserFeedback } = require('./models');

// Middleware to parse JSON bodies
router.use(express.json());

// User creation route
router.post('/users', async (req, res) => {
  const { ageGroup, gender, healthcareProfessionalType, previousParticipation } = req.body;
  try {
    const user = await insertUser(ageGroup, gender, healthcareProfessionalType, previousParticipation, null);
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

// Get answers with their questions
router.get('/answers', async (req, res) => {
  try {
    const result = await pool.query(`
      WITH answer_ratings AS (
        SELECT 
          a.id AS answer_id,
          COUNT(r.id) AS rating_count
        FROM answers a
        LEFT JOIN ratings r ON a.id = r.answer_id
        GROUP BY a.id
      )
      SELECT 
        a.id AS answer_id,
        a.answer_text,
        q.id AS question_id,
        q.question_text,
        a.source
      FROM answers a
      JOIN questions q ON a.question_id = q.id
      JOIN answer_ratings ar ON a.id = ar.answer_id
      ORDER BY RANDOM() * (1.0 / (ar.rating_count + 1)) -- Weight by the number of ratings
      LIMIT 10
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching answers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Store user ratings and comments
router.post('/ratings', async (req, res) => {
  const { userId, responses } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const response of responses) {
      const { answerId, criteria } = response;
      await insertRating(
        userId,
        answerId,
        criteria.Knowledge,
        criteria.Helpfulness,
        criteria.Empathy
      );
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

// User feedback route
router.post('/feedback', async (req, res) => {
  const { userId, feedback } = req.body;
  try {
    await insertUserFeedback(userId, feedback);
    res.json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;