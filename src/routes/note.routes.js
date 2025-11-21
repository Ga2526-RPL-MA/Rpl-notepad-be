const express = require('express');
const router = express.Router();
const prisma = require('../middleware/prismaClient');
const authenticateToken = require('../middleware/authMiddleware');
const { url } = require('inspector');

router.get('/', authenticateToken, async (req, res) => {
    try {
        const note = await prisma.note.findMany();
        res.json(note);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching notes data' });
    }
});

router.get('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const notes = await prisma.note.findUnique({
            where: { id: parseInt(id) },
            include: {
                class: true,
                noteFiles: true
            }
        });

        const host = `${req.protocol}://${req.get("host")}`;

        const modifiedFile = notes.noteFiles.map(file => ({
            id: file.id,
            url: `${host}/${file.filePath}`
        }));

        res.json({
            class: notes.class.name,
            content: notes.content,
            week: notes.week,
            files: modifiedFile
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching notes and upload data' });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    const { content, week, classId } = req.body;

    try {
        const findClass = await prisma.class.findUnique({
            where: { id: classId }
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

        const newNote = await prisma.note.create({
            data: {
                content,
                week,
                classId
            }
        });
        res.status(201).json(newNote)
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating note' });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    try {
        const updatedNote = await prisma.note.update({
            where: { id: parseInt(id) },
            data: {
                content
            }
        });
        res.json(updatedNote);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating note' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.note.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).end()
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting note' });
    }
});

module.exports = router;