const jwt = require('jsonwebtoken');

// Validate token (signature + expiration)
const validateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log(authHeader)
    const token = authHeader?.split(' ')[1]; // Expect Bearer token

    if (!token) return res.status(401).json({ error: 'Missing token' });

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// Authorize regular user or admin
const authorizeStandard = (req, res, next) => {
    validateToken(req, res, () => {
        const { role } = req.user;
        if (role === 'standard' || role === 'admin') return next();
        return res.status(403).json({ error: 'Access denied' });
    });
};

// Authorize admin only
const authorizeAdmin = (req, res, next) => {
    validateToken(req, res, () => {
        const { role } = req.user;
        console.log(req.user)
        if (role === 'admin') return next();
        return res.status(403).json({ error: 'Admins only' });
    });
};

module.exports = {
    validateToken,
    authorizeStandard,
    authorizeAdmin
};
