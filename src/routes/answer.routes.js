const express = require('express');
const router = express.Router();
const prisma = require('../middleware/prismaClient');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, async (req, res) => {
    try {
        const answers = await prisma.answer.findMany();
        res.json(answers);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching answers data' });
    }
});

router.get('/search', authenticateToken, async (req, res) => {
    const { q } = req.query;

    try {
        const answers = await prisma.answer.findMany({
            where: {
                OR: [
                    { userName: { contains: q, mode: 'insensitive' } },
                    { content: { contains: q, mode: 'insensitive' } }
                ]
            }
        });
        res.json(answers);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error searching answer' });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    const { content, issueId } = req.body;

    try {
        const findIssue = await prisma.issue.findUnique({
            where: { id: issueId }
        });
        if (!findIssue) {
            return res.status(404).json({ error: 'Issue not found' });
        }

        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }

        if (!issueId) {
            return res.status(400).json({ error: 'Issue ID is required' });
        }

        const newAnswer = await prisma.answer.create({
            data: {
                content,
                userName: req.user.name,
                issueId
            }
        });
        res.status(201).json(newAnswer);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error posting answers' });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    try {
        const updatedAnswer = await prisma.answer.update({
            where: { id: parseInt(id) },
            data: {
                content
            }
        });
        res.json(updatedAnswer);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating answer' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.answer.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).end();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting answer' });
    }
});

module.exports = router;