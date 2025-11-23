const express = require('express');
const router = express.Router();
const prisma = require('../config/prismaClient');
const authenticateToken = require('../middleware/authMiddleware')

router.get('/', authenticateToken, async (req, res) => {
    try {
        const tasks = await prisma.task.findMany({
            where: { userId: req.user.id }
        });
        res.json(tasks);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching task data' });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    const { title, description, dueDate, classId } = req.body;

    try {
        const findClass = await prisma.class.findUnique({
            where: { id: classId }
        });
        if (!findClass) {
            return res.status(404).json({ error: 'Class not found' });
        }

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        if (!classId) {
            return res.status(400).json({ error: 'Class ID is required' });
        }

        const newTask = await prisma.task.create({
            data: {
                title,
                description,
                dueDate: dueDate ? new Date(dueDate) : null,
                userId: req.user.id,
                classId
            }
        });
        res.status(201).json(newTask);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating task' });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, description, dueDate, status, classId } = req.body;

    try {
        const data = {
            title,
            description,
            status,
            classId
        };

        if (req.body.hasOwnProperty('dueDate')) {
            if (dueDate) {
                data.dueDate = new Date(dueDate);
            } else {
                data.dueDate = null;
            }
        };

        const updatedTask = await prisma.task.update({
            where: { id: parseInt(id) },
            data
        });
        res.json(updatedTask);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating task' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.task.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).end();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting task' });
    }
});

module.exports = router;