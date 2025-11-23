const express = require('express');
const router = express.Router();
const prisma = require('../config/prismaClient');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, async (req, res) => {
    try {
        const week = await prisma.week.findMany();
        res.json(week);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching week data' });
    }
});

router.get('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const classWeek = await prisma.week.findUnique({
            where: { id: parseInt(id) },
            select: {
                class: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                week: true,
                notes: {
                    select: {
                        userName: true
                    }
                }
            }
        });
        res.json(classWeek);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching week data' });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    const { week, classId } = req.body;

    try {
        const findClass = await prisma.class.findUnique({
            where: {  id: classId }
        });
        if (!findClass) {
            return res.status(404).json({ error: 'Class not found' });
        }

        if (!week) {
            return res.status(400).json({ error: 'Week is required' });
        }

        if (!classId) {
            return res.status(400).json({ error: 'Class ID is required' });
        }

        const newWeek = await prisma.week.create({
            data: {
                week,
                classId
            }
        });
        res.status(201).json(newWeek);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating week data' });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { week } = req.body;

    try {
        const updatedWeek = await prisma.week.update({
            where: { id: parseInt(id) },
            data: {
                week
            }
        });
        res.json(updatedWeek);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating week' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.week.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).end();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting week' });
    }
});

module.exports = router;