const express = require('express');
const router = express.Router();
const prisma = require('../middleware/prismaClient');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, async (req, res) => {
    try {
        const userClasses = await prisma.userClasses.findMany();
        res.json(userClasses);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching user class data' });
    }
});

router.get('/byuser/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const userClasses = await prisma.userClasses.findMany({
            where: { userId: parseInt(id) },
            select: {
                class: {
                    select: {
                        name: true,
                        lecturer: true,
                        timetable: true,
                        room: true
                    }
                }
            }
        });
        res.json(userClasses);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching user class data' });
    }
});

router.get('/byclass/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const userClasses = await prisma.userClasses.findMany({
            where: { classId: parseInt(id) },
            select: {
                user: {
                    select: {
                        name: true,
                        nrp: true,
                        email: true
                    }
                }
            }
        });
        res.json(userClasses);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching user class data' });
    }
});

router.get('/byloggedin', authenticateToken, async (req, res) => {
    try {
        const userClasses = await prisma.userClasses.findMany({
            where: { id: req.user.id },
            select: {
                class: {
                    select: {
                        name: true,
                        lecturer: true,
                        timetable: true,
                        room: true
                    }
                }
            }
        });
        res.json(userClasses);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching user class data' });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    const { userId, classId } = req.body;

    try {
        const findUser = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!findUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const findClass = await prisma.class.findUnique({
            where: { id: classId }
        });
        if (!findClass) {
            return res.status(404).json({ error: 'Class not found' });
        }

        const newUserClasses = await prisma.userClasses.create({
            data: {
                userId,
                classId
            }
        });
        res.status(201).json(newUserClasses)
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating user class data' });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { userId, classId } = req.body;

    try {
        const findUser = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!findUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const findClass = await prisma.class.findUnique({
            where: { id: classId }
        });
        if (!findClass) {
            return res.status(404).json({ error: 'Class not found' });
        }

        const updatedUserClasses = await prisma.userClasses.update({
            where: { id: parseInt(id) },
            data: {
                userId,
                classId
            }
        });
        res.json(updatedUserClasses);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating user class' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.userClasses.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).end()
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting user class' });
    }
});

module.exports = router;