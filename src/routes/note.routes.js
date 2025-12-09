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

router.get('/search', authenticateToken, async (req, res) => {
    const { q } = req.query;

    try {
        const notes = await prisma.note.findMany({
            where: {
                OR: [
                    { userName: { contains: q, mode: 'insensitive' } },
                    { content: { contains: q, mode: 'insensitive' } }
                ]
            }
        });
        res.json(notes);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error searching note' });
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
        const note = await prisma.note.findUnique({
            where: { id: parseInt(id) }
        });
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        if (note.userName !== req.user.name) {
            return res.status(403).json({ error: 'Error editing others note' });
        }

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

router.patch('/removeNote/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const note = await prisma.note.findUnique({
            where: { id: parseInt(id) }
        });
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        const removedContent = await prisma.note.update({
            where: { id: parseInt(id) },
            data: {
                content: null
            }
        });
        res.json(removedContent);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error removing note content' });
    }
});

router.patch('/removeFile/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const note = await prisma.note.findUnique({
            where: { id: parseInt(id) }
        });
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        
        const { data, error } = await supabase.storage
            .from('notes')
            .list(`notes/${id}/`)

        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error reading folder' });
        }

        if (!data || data.length === 0) {
            return res.json({ error: 'No files in storage' });
        }

        const paths = data.map(files => `notes/${id}/${files.name}`);

        const { deleteError } = await supabase.storage
            .from('notes')
            .remove(paths);

        if (deleteError) {
            console.error(deleteError);
            return res.status(500).json({ error: 'Error deleting note' });
        }

        await prisma.noteFile.deleteMany({
            where: { noteId: parseInt(id) },
        });
        res.status(204).end()
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error removing note file' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.note.delete({
            where: { id: parseInt(id) }
        });

        const { data, error } = await supabase.storage
            .from('notes')
            .list(`notes/${id}/`)

        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error reading folder' });
        }

        if (!data || data.length === 0) {
            return res.json({ error: 'No files in storage' });
        }

        const paths = data.map(files => `notes/${id}/${files.name}`);

        const { deleteError } = await supabase.storage
            .from('notes')
            .remove(paths);

        if (deleteError) {
            console.error(deleteError);
            return res.status(500).json({ error: 'Error deleting note' });
        }

        res.status(204).end()
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting note' });
    }
});

module.exports = router;