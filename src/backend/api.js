const express = require('express');
const router = express.Router();
const pool = require('./database');
const WebSocket = require('ws');
const { insertUser, insertSession, insertRating, insertUserFeedback, updateDashboardStats, endSession, getDashboardStats } = require('./models');

// Middleware to parse JSON bodies
router.use(express.json());

// WebSocket server
const wss = new WebSocket.Server({ noServer: true, path: '/ws' });

// Broadcast dashboard stats to all connected clients
function broadcastDashboardStats(stats) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(stats));
    }
  });
}

// User creation and session start route
router.post('/start-session', async (req, res) => {
  const { ageGroup, gender, isHealthcarePersonnel, healthcareProfessionalType, hasDiabetes, educationLevel, previousParticipation } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const user = await insertUser(
      client, 
      ageGroup, 
      gender, 
      hasDiabetes,
      isHealthcarePersonnel,
      healthcareProfessionalType, 
      educationLevel,
      previousParticipation
    );
    const session = await insertSession(client, user.id);
    await client.query('COMMIT');
    res.json({ userId: user.id, sessionId: session.id });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error starting session:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
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

// Store user ratings
router.post('/ratings', async (req, res) => {
  const { sessionId, responses } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    let latestStats;
    for (const response of responses) {
      const { answerId, questionId, criteria, responseTime } = response;
      const rating = await insertRating(
        client,
        sessionId,
        answerId,
        questionId,
        criteria.Knowledge,
        criteria.Helpfulness,
        criteria.Empathy,
        responseTime
      );
      latestStats = await updateDashboardStats(client, rating);
    }
    await client.query('COMMIT');
    broadcastDashboardStats(latestStats);
    res.json({ message: 'Ratings saved successfully', dashboardStats: latestStats });
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
  const { sessionId, feedback } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await insertUserFeedback(client, sessionId, feedback);
    await client.query('COMMIT');
    res.json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// Get dashboard stats
router.get('/dashboard-stats', async (req, res) => {
  const client = await pool.connect();
  try {
    const stats = await getDashboardStats(client);
    res.json(stats); // Ensure valid JSON is returned
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Internal server error' }); // Return JSON error message
  } finally {
    client.release();
  }
});

// End session route
router.post('/end-session', async (req, res) => {
  const { sessionId } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await endSession(client, sessionId);
    await client.query('COMMIT');
    res.json({ message: 'Session ended successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error ending session:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

module.exports = { router, wss };
