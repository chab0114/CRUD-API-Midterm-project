const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const validateMovie = require('../middleware/validateMovie');
const cacheMiddleware = require('../middleware/cacheMiddleware');

router.get('/', movieController.getAllMovies);

router.get('/:id', movieController.getMovieById);

router.post('/', validateMovie, cacheMiddleware, movieController.createMovie);

router.put('/:id', validateMovie, cacheMiddleware, movieController.updateMovie);

router.delete('/:id', movieController.deleteMovie);

module.exports = router;