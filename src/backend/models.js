const pool = require('./database');

// Insert a new user
const insertUser = async (client, ageGroup, gender, hasDiabetes, isHealthcarePersonnel, healthcareProfessionalType, educationLevel, previousParticipation) => {
  try {
    const result = await client.query(
      'INSERT INTO users (age_group, gender, has_diabetes, is_healthcare_personnel, healthcare_professional_type, education_level, previous_participation) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [ageGroup, gender, hasDiabetes, isHealthcarePersonnel === 'yes', healthcareProfessionalType || null, educationLevel, previousParticipation]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error inserting user:', error);
    throw error;
  }
};

// Insert a new session
const insertSession = async (client, userId) => {
  try {
    const result = await client.query(
      'INSERT INTO sessions (user_id, start_time) VALUES ($1, CURRENT_TIMESTAMP) RETURNING id',
      [userId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error inserting session:', error);
    throw error;
  }
};

// Insert a new rating
const insertRating = async (client, sessionId, answerId, questionId, knowledge, helpfulness, empathy, responseTime) => {
  try {
    const result = await client.query(
      `INSERT INTO ratings (session_id, answer_id, question_id, knowledge, helpfulness, empathy, response_time)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [sessionId, answerId, questionId, knowledge, helpfulness, empathy, responseTime]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error inserting rating:', error);
    throw error;
  }
};

// Insert user feedback
const insertUserFeedback = async (client, sessionId, feedback) => {
  try {
    await client.query(
      'INSERT INTO user_feedback (session_id, feedback) VALUES ($1, $2)',
      [sessionId, feedback]
    );
  } catch (error) {
    console.error('Error inserting user feedback:', error);
    throw error;
  }
};

// Update dashboard stats
const updateDashboardStats = async (client, rating) => {
  try {
    const result = await client.query(`
      UPDATE dashboard_stats
      SET 
        total_responses = total_responses + 1,
        avg_response_time = (avg_response_time * total_responses + $1) / (total_responses + 1),
        avg_knowledge = (avg_knowledge * total_responses + $2) / (total_responses + 1),
        avg_helpfulness = (avg_helpfulness * total_responses + $3) / (total_responses + 1),
        avg_empathy = (avg_empathy * total_responses + $4) / (total_responses + 1),
        last_updated = CURRENT_TIMESTAMP
      WHERE id = 1
      RETURNING *
    `, [rating.response_time, rating.knowledge, rating.helpfulness, rating.empathy]);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating dashboard stats:', error);
    throw error;
  }
};

// End a session
const endSession = async (client, sessionId) => {
  try {
    await client.query('UPDATE sessions SET end_time = CURRENT_TIMESTAMP WHERE id = $1', [sessionId]);
  } catch (error) {
    console.error('Error ending session:', error);
    throw error;
  }
};

// Get dashboard stats
const getDashboardStats = async (client) => {
  try {
    const result = await client.query('SELECT * FROM dashboard_stats WHERE id = 1');
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// Get user count
const getUserCount = async (client) => {
  try {
    const result = await client.query('SELECT COUNT(*) FROM users');
    return parseInt(result.rows[0].count);
  } catch (error) {
    console.error('Error fetching user count:', error);
    throw error;
  }
};

module.exports = {
  insertUser,
  insertSession,
  insertRating,
  insertUserFeedback,
  updateDashboardStats,
  endSession,
  getDashboardStats,
  getUserCount,
};
