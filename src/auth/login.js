const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const prisma = require('../middleware/prismaClient');
const emailValidator = require('../validator/getUserValidator');
const { generateAccessToken } = require('../utils/tokenUtils');
const validate = require('../middleware/validate');

router.post('/', emailValidator, validate, async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const findUser = await prisma.user.findFirst({
            where: { email: email }
        });
        if (!findUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, findUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        
        const accessToken = generateAccessToken(findUser);

        res.status(200).json({
            message: 'Login successful',
            nrp: findUser.nrp,
            role: findUser.role,
            accessToken: accessToken,
        });
    }
    catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Error logging in user' });
    }
});

module.exports = router;