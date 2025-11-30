const express = require('express');
const router = express.Router();
const prisma = require('../middleware/prismaClient');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, async (req, res) => {
    try {
        const classes = await prisma.class.findMany();
        res.json(classes);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching class data' });
    }
});

router.get('/search', authenticateToken, async (req, res) => {
    const { q } = req.query;

    try {
        const classes = await prisma.class.findMany({
            where: {
                OR: [
                    { name: { contains: q, mode: 'insensitive' } },
                    { lecturer: { contains: q, mode: 'insensitive' } },
                    { timetable: { contains: q, mode: 'insensitive' } },
                    { room: { contains: q, mode: 'insensitive' } }
                ]
            },
            select: {
                id: true,
                name: true,
                lecturer: true,
                timetable: true,
                room: true
            }
        });
        res.json(classes)
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error searching class' });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    const { name, lecturer, timetable, room } = req.body;

    try {
        const newClass = await prisma.class.create({
            data: {
                name,
                lecturer,
                timetable,
                room
            }
        });

        const newWeek = Array.from({ length: 16 }, (_, i) => ({
            week: i + 1,
            classId: newClass.id
        }));

        await prisma.week.createMany({
            data: newWeek
        });
        
        res.status(201).json(newClass);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating class' });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, lecturer, timetable, room } = req.body;

    try {
        const updatedClass = await prisma.class.update({
            where: { id: parseInt(id) },
            data: {
                name,
                lecturer,
                timetable,
                room
            }
        });
        res.json(updatedClass);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating class' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.class.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).end();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting class' });
    }
});

module.exports = router;