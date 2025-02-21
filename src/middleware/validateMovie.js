const validateMovie = (req, res, next) => {
    console.log("Validating movie data:", req.body);
    
    const { title, userRating, review } = req.body;

    if (!title || !userRating || !review) {
        return res.status(400).json({
            error: 'Missing required fields: title, userRating, and review are required'
        });
    }

    if (userRating < 1 || userRating > 10) {
        return res.status(400).json({
            error: 'User rating must be between 1 and 10'
        });
    }

    console.log("Validation successful");
    next();
};

module.exports = validateMovie;