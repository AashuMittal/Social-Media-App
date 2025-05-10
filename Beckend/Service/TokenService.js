const jwt = require('jsonwebtoken');

exports.createToken = (user) => {
    const secretKey = process.env.JWT_SECRET; 
    return jwt.sign(
        { id: user.id, name: user.name, email: user.email },  
        secretKey,
        { expiresIn: '365d' }  
    );
};
