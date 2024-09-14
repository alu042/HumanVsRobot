const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Set up a connection to a robust database solution (e.g., PostgreSQL)
const pool = new Pool({
  user: 'your_database_user',
  host: 'your_database_host',
  database: 'your_database_name',
  password: 'your_database_password',
  port: 5432,
});

// Implement proper data sanitization and validation
const sanitizeInput = (input) => {
  // Add your sanitization logic here
  return input.replace(/[^a-zA-Z0-9 ]/g, '');
};

// Encrypt sensitive user information both in transit and at rest
const encryptData = (data) => {
  const algorithm = 'aes-256-ctr';
  const secretKey = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encryptedData = Buffer.concat([cipher.update(data), cipher.final()]);

  return {
    iv: iv.toString('hex'),
    data: encryptedData.toString('hex'),
    key: secretKey.toString('hex'),
  };
};

const decryptData = (hash) => {
  const algorithm = 'aes-256-ctr';
  const secretKey = Buffer.from(hash.key, 'hex');
  const iv = Buffer.from(hash.iv, 'hex');

  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  const decryptedData = Buffer.concat([
    decipher.update(Buffer.from(hash.data, 'hex')),
    decipher.final(),
  ]);

  return decryptedData.toString();
};

// Add details needed to create and run the database
const createDatabase = async () => {
  try {
    await pool.query(`
      CREATE DATABASE survey_app;
    `);
    console.log('Database created successfully');
  } catch (error) {
    console.error('Error creating database:', error);
  }
};

module.exports = {
  pool,
  sanitizeInput,
  encryptData,
  decryptData,
  createDatabase,
};
