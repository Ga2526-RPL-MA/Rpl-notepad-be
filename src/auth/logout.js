const express = require('express');
const router = express.Router();
const prisma = require('../middleware/prismaClient');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token required' });
    }

    try {
        await prisma.refreshToken.delete({
            where: { token: refreshToken }
        });

        res.status(200).json({ message: 'Logout successful' });
    } 
    catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Token not found' });
        }
        
        res.status(500).json({ error: 'Error logging out' });
    }
});

router.post('/all', authenticateToken, async (req, res) => {
    try {
        await prisma.refreshToken.deleteMany({
            where: { userId: req.user.id }
        });

        res.status(200).json({ message: 'Logged out from all devices' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error logging out' });
    }
});

module.exports = router;