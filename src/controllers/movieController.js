const omdbService = require('../services/omdbService');

let movies = [];

const movieController = {
    async createMovie(req, res) {
        try {
            console.log("Creating movie with data:", req.body);
            const { title, userRating, review } = req.body;
            
            let movieApiData = req.movieApiData;
            if (!movieApiData) {
                console.log("Fetching movie data from API for:", title);
                movieApiData = await omdbService.getMovieInfo(title);
                await req.redisClient.setEx(
                    `movie:${title.toLowerCase()}`,
                    3600, 
                    JSON.stringify(movieApiData)
                );
                console.log("Cached movie data for:", title);
            }

            const newMovie = {
                id: Date.now(),
                title,
                userRating,
                review,
                ...movieApiData
            };

            movies.push(newMovie);
            console.log("Movie created:", newMovie.id);
            res.status(201).json(newMovie);
        } catch (error) {
            console.error("Error creating movie:", error.message);
            res.status(500).json({ error: error.message });
        }
    },

    getAllMovies(req, res) {
        console.log("Getting all movies, count", movies.length);
        res.json(movies);
    },

    getMovieById(req, res) {
        const id = parseInt(req.params.id);
        console.log("Getting movie by ID:", id);

        const movie = movies.find(m => m.id === id);
        if (!movie) {
            console.log("Movie not found:", id);
            return res.status(404).json({error: 'Movie not found'});
        }

        console.log("Found movie:", movie.id);
        res.json(movie);
    },

    async updateMovie(req, res) {
        try {
            const id = parseInt(req.params.id);
            console.log("Updating movie:", id, "with data:", req.body);
            
            const { title, userRating, review } = req.body;
            const movieIndex = movies.findIndex(m => m.id === id);
            
            if (movieIndex === -1) {
                console.log("Movie not found for update:", id);
                return res.status(404).json({ error: 'Movie not found' });
            }

            let movieApiData = req.movieApiData;
            if (!movieApiData) {
                console.log("Fetching updated movie data from API for:", title);
                movieApiData = await omdbService.getMovieInfo(title);

                await req.redisClient.setEx(
                    `movie:${title.toLowerCase()}`,
                    3600,
                    JSON.stringify(movieApiData)
                );
                console.log("Cached updated movie data for:", title);
            }

            movies[movieIndex] = {
                ...movies[movieIndex],
                title,
                userRating,
                review,
                ...movieApiData
            };

            console.log("Movie updated:", id);
            res.json(movies[movieIndex]);
        } catch (error) {
            console.error("Error updating movie:", error.message);
            res.status(500).json({ error: error.message });
        }
    },

    deleteMovie(req, res) {
        const id = parseInt(req.params.id);
        console.log("Deleting movie:", id);
        
        const movieIndex = movies.findIndex(m => m.id === id);
        if (movieIndex === -1) {
            console.log("Movie not found for deletion:", id);
            return res.status(404).json({ error: 'Movie not found' });
        }
        
        movies.splice(movieIndex, 1);
        console.log("Movie deleted:", id);
        res.status(204).send();
    }  
};

module.exports = movieController;