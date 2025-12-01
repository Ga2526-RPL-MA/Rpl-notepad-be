const express = require('express');
const router = express.Router();
const prisma = require('../middleware/prismaClient');
const authenticateToken = require('../middleware/authMiddleware')

router.get('/', authenticateToken, async (req, res) => {
    try {
        const issue = await prisma.issue.findMany();
        res.json(issue);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching issues data' });
    }
});

router.get('/search', authenticateToken, async (req, res) => {
    const { q } = req.query;

    try {
        const issues = await prisma.issue.findMany({
            where: {
                OR: [
                    { userName: { contains: q, mode: 'insensitive' } },
                    { content: { contains: q, mode: 'insensitive' } }
                ]
            }, 
            select: {
                class: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                id: true,
                userName: true,
                content: true,
                reportedAt: true
            }
        });
        res.json(issues);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error searching issue' });
    }
});

router.get('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const issue = await prisma.issue.findUnique({
            where: { id: parseInt(id) },
            select: { //Issue Table
                class: { //Class Table
                    select: {
                        id: true,
                        name: true
                    }
                },
                id: true,
                userName: true,
                content: true,
                reportedAt: true,
                answers: { //Answers Table
                    select: {
                        id: true,
                        userName: true,
                        content: true,
                        answeredAt: true,
                        subAnswers: { //Sub-Answers Table
                            select: {
                                id: true,
                                userName: true,
                                content: true,
                                answeredAt: true,
                            }
                        }
                    }
                }
            }
        });
        res.json(issue);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching issues data' });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    const { content, classId } = req.body;

    try {
        const findClass = await prisma.class.findUnique({
            where: { id: classId }
        });
        if (!findClass) {
            return res.status(404).json({ error: 'Class not found' });
        }

        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }

        if (!classId) {
            return res.status(400).json({ error: 'Class ID is required' });
        }

        const newIssue = await prisma.issue.create({
            data: {
                content,
                userName: req.user.name,
                classId
            }
        });
        res.status(201).json(newIssue);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating issue' });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    try {
        const updatedIssue = await prisma.issue.update({
            where: { id: parseInt(id) },
            data: {
                content
            }
        });
        res.json(updatedIssue);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating issue' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.issue.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).end();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting issue' });
    }
});

module.exports = router;