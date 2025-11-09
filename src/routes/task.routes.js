const express = require('express');
const router = express.Router();
const prisma = require('../middleware/prismaClient');
const authenticateToken = require('../middleware/authMiddleware')

router.get('/', authenticateToken, async (req, res) => {
    try {
        const tasks = await prisma.task.findMany({
            where: { id: req.user.id }
        });
        res.json(tasks);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching task data' });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { title, description, dueDate, classId } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        if (!dueDate) {
            return res.status(400).json({ error: 'Due date is required' });
        }

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        if (!classId) {
            return res.status(400).json({ error: 'Class ID is required' });
        }

        const newTask = await prisma.task.create({
            data: {
                title,
                description,
                dueDate: new Date(dueDate),
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
        const updatedTask = await prisma.task.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                dueDate: new Date(dueDate),
                status,
                classId
            }
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