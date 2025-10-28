const express = require('express');
const router = express.Router();
const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
    try {
        const { title, description, dueDate, userId, classId } = req.body;


        if (!title || !userId || !classId)
            return res.status(400).json({ error: 'Judul dan mahasiswaId wajib diisi' });

        const tugas = await prisma.task.create({
            data: {
                title,
                description,
                dueDate: dueDate ? new Date(dueDate) : null,
                userId,
                classId,
            },
        });

        res.status(201).json(tugas);
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const tasks = await prisma.task.findMany();
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const task = await prisma.task.findUnique({
            where: { id: parseInt(id) },
            include: { user: true },
        });
        if (!task) {
            return res.status(404).json({ message: "Task tidak ditemukan" });
        }
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, dueDate } = req.body;
        const updatedTask = await prisma.task.update({
            where: { id: parseInt(id) },
            data: { title, description, dueDate: dueDate ? new Date(dueDate) : undefined },
        });
        res.json({ message: "Task Telah diupdate", task: updatedTask });
    }
    catch (error) {
        res.status(400).json({ error: 'Gagal memperbarui task' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.task.delete({ where: { id: parseInt(id) } });
        res.json({ message: "Task Berhasil dihapus" });
    }
    catch (error) {
        res.status(400).json({ error: 'Gagal menghapus task' });
    }
});

module.exports = router;