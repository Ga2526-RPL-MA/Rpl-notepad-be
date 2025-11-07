const express = require('express');
const router = express.Router();
const prisma = require('../middleware/prismaClient');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
    try {
        const subAnswer = await prisma.subAnswer.findMany();
        res.json(subAnswer);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error fetching sub answers data' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { content, answerId } = req.body;

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
        console.log(error);
        res.status(500).json({ error: 'Error posting sub answers' });
    }
});

router.put('/:id', async (req, res) => {
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
        console.log(error);
        res.status(500).json({ error: 'Error updating sub answer' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.subAnswer.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).end();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error deleting sub answer' });
    }
});

module.exports = router;