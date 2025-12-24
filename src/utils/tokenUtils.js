const jwt = require('jsonwebtoken');

function generateAccessToken(user) {
    const payload = {
        id: user.id,
        name: user.name,
        nrp: user.nrp,
        email: user.email,
        role: user.role
    };

    return jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }
    );
};

module.exports = {
    generateAccessToken
};