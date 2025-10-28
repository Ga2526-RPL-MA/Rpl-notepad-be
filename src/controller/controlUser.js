
const { PrismaClient } = require('../../generated/prisma'); 
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

 exports.getUser = async (req, res) => {
    try{
        const users = await prisma.user.findMany();
        res.json(users);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}    

exports.getUserId = async (req, res) => {
    try{
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            include: {
                classes: {
                    include: {
                        class: true, 
                    },
                },
                tasks: true,
            },
        });
        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }
        res.json(user);
    }catch(error){
        res.status(500).json({ message: error.message });       
    }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, nrp, email, password, role } = req.body;

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, nrp, email, password, role },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: 'Mahasiswa berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};