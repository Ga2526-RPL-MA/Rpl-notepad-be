const express = require('express');
const router = express.Router();
const prisma = require('../config/prismaClient');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, async (req, res) => {
    try {
        const findUser = await prisma.user.findUnique({
            where: { id: req.user.id }
        });
        res.status(200).json(findUser);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching user data' });
    }
});

module.exports = router;