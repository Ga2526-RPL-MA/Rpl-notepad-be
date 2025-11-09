const express = require('express');
const router = express.Router();
const prisma = require('../middleware/prismaClient');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, async (req, res) => {
    try {
        const subAnswer = await prisma.subAnswer.findMany();
        res.json(subAnswer);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching sub answers data' });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    const { content, answerId } = req.body;

    try {
        const findAnswer = await prisma.answer.findUnique({
            where: { id: answerId }
        });
        if (!findAnswer) {
            return res.status(404).json({ error: 'Answer not found' });
        }

        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }

        if (!answerId) {
            return res.status(400).json({ error: 'Answer ID is required' });
        }

        const newSubAnswer = await prisma.subAnswer.create({
            data: {
                content,
                userName: req.user.name,
                answerId
            }
        });
        res.status(201).json(newSubAnswer);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error posting sub answers' });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    try {
        const updatedSubAnswer = await prisma.subAnswer.update({
            where: { id: parseInt(id) },
            data: {
                content
            }
        });
        res.json(updatedSubAnswer);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating sub answer' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.subAnswer.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).end();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting sub answer' });
    }
});

module.exports = router;