const validateApiKey = (req, res, next) => {
    try {
        const apiKey = req.headers['x-api-key'];

        if (!apiKey) {
            return res.status(401).json({error: 'API key is missing'});
        }

        if (apiKey !== process.env.API_KEY) {
            return res.status(401).json({error: 'Invalid API key'});
        }

        next();
    } catch (err) {
        res.status(500).json({error: 'API key validation failed', message: err.message});
    }
};

export default validateApiKey;