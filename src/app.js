const express = require('express');
const omdbService = require('./services/omdbService');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Movie Tracker API is running');
} );

app.get('/test-api/:title', async (req, res) => {
    try {
      const movieData = await omdbService.getMovieInfo(req.params.title);
      res.json(movieData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

