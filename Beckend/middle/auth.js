const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).send('No token provided');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
        if (err) {
            console.error('JWT verification error:', err.message);
            return res.status(403).send('Failed to authenticate token');
        }

        req.user = decodedUser; 
     
        next();
    });
};

module.exports = authenticateJWT;
