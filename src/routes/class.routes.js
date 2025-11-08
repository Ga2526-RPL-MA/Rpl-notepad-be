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

router.post('/', authenticateToken, async (req, res) => {
    const { name, lecturer, timetable, room } = req.body;

    try {
        const newClass = await prisma.class.create({
            data: {
                name,
                lecturer,
                timetable: new Date(timetable),
                room
            }
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
                timetable: new Date(timetable),
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