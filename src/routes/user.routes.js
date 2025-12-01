const express = require('express');
const router = express.Router();
const prisma = require('../middleware/prismaClient');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, async (req, res) => {
    try {
        const user = await prisma.user.findMany();
        res.json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching user data' });
    }
});

router.get('/search', authenticateToken, async (req, res) => {
    const { q } = req.query;

    try {
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: q, mode: 'insensitive' } },
                    { nrp: { contains: q, mode: 'insensitive' } },
                    { email: {contains: q, mode: 'insensitive' }  }
                ]
            },
            select: {
                id: true,
                name: true,
                nrp: true,
                email: true,
                role: true
            }
        });
        res.json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error searching users' });
    }
});

//Admin edit user
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, nrp, role } = req.body;

    try {
        const editedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: {
                name,
                nrp,
                role
            }
        });
        res.json(editedUser);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating user' });
    }
});

//User edit self
router.put('/', authenticateToken, async (req, res) => {
    const id = req.user.id;
    const { name, nrp } = req.body;

    try {
        const editedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: {
                name,
                nrp
            }
        });
        res.json(editedUser);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating user' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.user.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting user' });
    }
});

module.exports = router;