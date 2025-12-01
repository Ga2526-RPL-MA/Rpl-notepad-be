const express = require('express');
const router = express.Router();
const prisma = require('../middleware/prismaClient');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, async (req, res) => {
    try {
        await prisma.refreshToken.deleteMany({
            where: { userId: req.user.id }
        });

        res.status(200).json({ message: 'Logout Success' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error logging out' });
    }
});

module.exports = router;