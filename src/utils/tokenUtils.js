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
        { expiresIn: '15m' }
    );
};

function generateRefreshToken(userId) {
    return jwt.sign(
        { userId: userId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );
};

function generateRefreshTokenExpiry() {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    return expiresAt;
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    generateRefreshTokenExpiry
};