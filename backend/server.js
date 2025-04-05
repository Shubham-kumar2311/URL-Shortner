const express = require('express');
const { connectToMongoDB } = require('./connect');
const urlRoute = require('./routes/url');
const userRoute = require('./routes/user');
const path = require('path');
const cors = require('cors'); // Add this
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8001;

// Enable CORS for all origins (or specify http://localhost:3000)
app.use(cors()); // Add this

app.use(express.json());
app.use('/api', urlRoute);
app.use('/auth', userRoute);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../frontend/build', 'index.html')));
}

connectToMongoDB(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start server for locally
app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));

// Start server for web
module.exports = app;