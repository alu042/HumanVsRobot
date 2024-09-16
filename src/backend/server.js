const express = require('express');
const path = require('path');
const cors = require('cors');
const apiRouter = require('./api');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const app = express();

app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Use API routes
app.use('/api', apiRouter);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../build')));

// Catch-all handler for any request that doesn't match the above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});