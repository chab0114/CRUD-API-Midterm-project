const express = require('express');
const omdbService = require('./services/omdbService');
const redis = require('redis');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const redisClient = redis.createClient({
    url: process.env.REDIS_URL
});
const validateMovie = require('./middleware/validateMovie');
const cacheMiddleware = require('./middleware/cacheMiddleware');

(async () => {
    await redisClient.connect().catch(console.error);
    console.log('Connected to Redis');
})();
  

app.use(express.json());

app.use((req, res, next) => {
    req.redisClient = redisClient;
    next()
});

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

app.get('/test-redis', async (req, res) => {
    try {
      await req.redisClient.set('test', 'Redis is working!');
      const value = await req.redisClient.get('test');
      res.send(value);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.post('/test-validation', validateMovie, (req, res) => {
    res.json({ message: 'Validation passed!', data: req.body });
});

app.post('/test-cache', cacheMiddleware, async (req, res) => {
    try {
        const { title } = req.body;
        
        if (req.movieApiData) {
            return res.json({
                source: 'cache',
                data: req.movieApiData
            });
        }
        
        const movieData = await omdbService.getMovieInfo(title);
        
        if (req.redisClient) {
            await req.redisClient.setEx(
                `movie:${title.toLowerCase()}`,
                3600,
                JSON.stringify(movieData)
            );
            console.log("Cached data for:", title);
        }
        
        res.json({
            source: 'api',
            data: movieData
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



