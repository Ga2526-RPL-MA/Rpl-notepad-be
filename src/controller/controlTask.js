const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

exports.getAllTasks = async (req, res) => {
    try{
        const tasks = await prisma.task.findMany();
        res.json(tasks);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}    

exports.getTaskById = async (req, res) => {
    try{
        const { id } = req.params;
        const task = await prisma.task.findUnique({
            where: { id: parseInt(id) },
            include: { user: true },
        });
        if (!task) {
            return res.status(404).json({ message: "Task tidak ditemukan" });
        }
        res.json(task);
    }catch(error){
        res.status(500).json({ message: error.message });       
    }
};

exports.updateTask = async (req,res) => {
    try{
        const { id } = req.params;
        const { title, description, Duedate } = req.body;
        const updatedTask = await prisma.task.update({
            where: { id: parseInt(id) },
            data: { title, description, dueDate: dueDate? new Date(dueDate) : undefined },
        });
res.json({ message: "Task Telah diupdate", task: updatedTask });
    }catch(error){
        res.status(400).json({ error: 'Gagal memperbarui task' });
    }
};

exports.deleteTask = async (req, res) => {
    try{
        const { id } = req.params;
        await prisma.task.delete({ where : { id: parseInt(id) } });
        res.json({ message: "Task Berhasil dihapus" });
    }catch(error){
        res.status(400).json({ error: 'Gagal menghapus task' });
    }
};