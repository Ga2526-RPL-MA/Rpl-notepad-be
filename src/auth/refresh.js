const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const prisma = require('../config/prismaClient');
const { generateAccessToken } = require('../utils/tokenUtils');

router.post('/', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token required' });
    }

    try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: 'Invalid or expired refresh token' });
            }

            const storedToken = await prisma.refreshToken.findUnique({
                where: { token: refreshToken },
                include: { user: true }
            });

            if (!storedToken) {
                return res.status(403).json({ error: 'Refresh token not found' });
            }

            if (new Date() > storedToken.expiresAt) {
                await prisma.refreshToken.delete({
                    where: { token: refreshToken }
                });

                return res.status(403).json({ error: 'Refresh token has expired' });
            }

            const newAccessToken = generateAccessToken(storedToken.user);

            res.status(200).json({ accessToken: newAccessToken });
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Error refreshing token' });
    }
});

module.exports = router;