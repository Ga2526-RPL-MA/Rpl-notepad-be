const express = require('express');
const router = express.Router();
const prisma = require('../middleware/prismaClient');
const authenticateToken = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadConfig');
const fs = require('fs');
const path = require('path');

router.get('/', authenticateToken, async (req, res) => {
    try {
        const noteFile = await prisma.noteFile.findMany();
        res.json(noteFile);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching note file data' });
    }
});

router.post('/', authenticateToken, upload.array("pdfs", 5), async (req, res) => {
    const files = req.files;
    const { noteId } = req.body;

    try {
        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'Need minimal 1 file uploaded' });
        }

        if (!noteId) {
            return res.status(400).json({ error: 'Note ID is required' });
        }

        const savedfiles = await prisma.noteFile.createMany({
            data: files.map((file) => ({
                noteId,
                filePath: file.path
            }))
        });
        res.status(201).json({
            message: `Success uploading ${files.length} files`,
            savedfiles
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error uploading file' });
    }
});

router.put('/:id', authenticateToken, upload.single("pdf"), async (req, res) => {
    const { id } = req.params;
    const newFile = req.file;

    try {
        if (!newFile) {
            return res.status(400).json({ error: 'File is required for update' });
        }

        const existingFile = await prisma.noteFile.findUnique({
            where: { id: parseInt(id) }
        });
        if (!existingFile) {
            return res.status(404).json({ error: 'File not found' });
        }

        if (existingFile.filePath && fs.existsSync(existingFile.filePath)) {
            fs.unlinkSync(existingFile.filePath);
        }

        const updatedFile = await prisma.noteFile.update({
            where: { id: parseInt(id) },
            data: { 
                filePath: newFile.path
            }
        });
        res.json({
            message: 'Success updating file',
            updatedFile
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating file' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const existingFile = await prisma.noteFile.findUnique({
            where: { id: parseInt(id) }
        });
        if (!existingFile) {
            return res.status(404).json({ error: 'File not found' });
        }

        if (existingFile.filePath && fs.existsSync(existingFile.filePath)) {
            fs.unlinkSync(existingFile.filePath);
        }

        await prisma.noteFile.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'File deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting file' });
    }
});

module.exports = router;