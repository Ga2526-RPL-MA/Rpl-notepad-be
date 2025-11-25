const express = require('express');
const router = express.Router();
const prisma = require('../middleware/prismaClient');
const authenticateToken = require('../middleware/authMiddleware');
const supabase = require('../middleware/supabaseClient');

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
                week: {
                    include: {
                        class: true
                    }
                },
                noteFiles: true
            }
        });

        const modifiedFile = notes.noteFiles.map(file => {
            const { data } = supabase.storage
                .from('notes')
                .getPublicUrl(file.filePath);

            return {
                id: file.id,
                url: data.publicUrl
            }
        });

        res.json({
            class: notes.week.class.name,
            content: notes.content,
            week: notes.week.week,
            files: modifiedFile
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching notes and upload data' });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    const { content, weekId } = req.body;

    try {
        const findWeek = await prisma.week.findUnique({
            where: { id: weekId }
        });
        if (!findWeek) {
            return res.status(404).json({ error: 'Week not found' });
        }

        if (!weekId) {
            return res.status(400).json({ error: 'Week ID is required' });
        }

        const newNote = await prisma.note.create({
            data: {
                userName: req.user.name,
                content,
                weekId
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