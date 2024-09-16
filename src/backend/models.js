const pool = require('./database');

// Insert a new user
const insertUser = async (ageGroup, gender, demographicData) => {
  try {
    const result = await pool.query(
      'INSERT INTO users (age_group, gender, demographic_data) VALUES ($1, $2, $3) RETURNING id AS user_id',
      [ageGroup, gender, demographicData]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error inserting user:', error);
    throw error;
  }
};

// Insert a new rating
const insertRating = async (userId, answerId, knowledge, helpfulness, empathy) => {
  try {
    await pool.query(
      `INSERT INTO ratings (user_id, answer_id, knowledge, helpfulness, empathy)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, answerId, knowledge, helpfulness, empathy]
    );
  } catch (error) {
    console.error('Error inserting rating:', error);
    throw error;
  }
};

// Insert user feedback
const insertUserFeedback = async (userId, feedback) => {
  try {
    await pool.query(
      'INSERT INTO user_feedback (user_id, feedback) VALUES ($1, $2)',
      [userId, feedback]
    );
  } catch (error) {
    console.error('Error inserting user feedback:', error);
    throw error;
  }
};

module.exports = {
  insertUser,
  insertRating,
  insertUserFeedback,
};