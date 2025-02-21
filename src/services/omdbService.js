const axios = require('axios');
require('dotenv').config();

class OmdbService {
    constructor() {
        this.apiKey = process.env.OMDB_API_KEY;
        this.baseUrl = 'http://www.omdbapi.com/';
    }

    async getMovieInfo(title) {
        try {
            const response = await axios.get(this.baseUrl, {
                params: {
                    t: title,
                    apikey: this.apiKey
                }
            });

            if (response.data.Error) {
                throw new Error(response.data.Error);
            }

            console.log("API response:", response.data);

            return {
                imdbRating: response.data.imdbRating,
                genre: response.data.Genre,
                year: response.data.Year,
                director: response.data.Director
            };
        } catch (error) {
            console.error("Error fetching movie:", error.message);
            throw new Error(`Failed to fetch movie data: ${error.message}`);
        }
    }
}

module.exports = new OmdbService();