const express = require('express');
const router = express.Router();
const prisma = require('../middleware/prismaClient');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, async (req, res) => {
    try {
        res.status(200).json({ message: 'Logout Success' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error logging out' });
    }
});

module.exports = router;