const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const prisma = require('../middleware/prismaClient');
const { createUserValidator } = require('../validator/createUserValidator');
const validate = require('../middleware/validate');

router.post('/', createUserValidator, validate, async (req, res) => {
    const { name, nrp, email, password, role } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { nrp: nrp }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'NRP already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                name,
                nrp,
                email,
                password: hashedPassword,
                role: role
            }
        });
        res.status(201).json({ message: 'User registered successfully', name: name, nrp: nrp, email: email });
    }
    catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
});

module.exports = router;