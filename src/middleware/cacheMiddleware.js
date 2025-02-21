const cacheMiddleware = async (req, res, next) => {
    try {
        const {title} = req.body;
        if(!title) return next();

        const cacheKey = `movie:${title.toLowerCase()}`;
        console.log("Checking cache for:", cacheKey);
        
        const cachedData = await req.redisClient.get(cacheKey);

        if (cachedData) {
            console.log("Cache hit for:", title);
            req.movieApiData = JSON.parse(cachedData);
            return next();
        }

        console.log("Cache miss for:", title);
        next();
    } catch (error) {
        console.error("Cache error:", error);
        next(error);
    }
};

module.exports = cacheMiddleware;