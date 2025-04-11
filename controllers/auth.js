const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const saltRounds = 12;

router.post('/sign-up', async (req, res) => {
    try{
                const userInDatabase = await User.findOne({ username: req.body.username });
        if(userInDatabase) {
            return res.status(409).json({err: 'username in use' });
        }
                const user = await User.create({
            username: req.body.username, 
            hashedPassword: bcrypt.hashSync(req.body.password, saltRounds)
        });
                const payload = {
            username: user.username,
            _id: user._id
        };
        const token = jwt.sign(
            {payload},
            process.env.JWT_SECRET
        )
                res.status(201).json({ token });
            } catch (error) {
                res.status(500).json({ error: error.message })
    }
});

router.post('/sign-in', async (req, res) => {
    try{
                const user = await User.findOne({
            username: req.body.username
        });
                if(!user) {
            return res.status(401).json({ error: 'invalid credentials'})
        }
                const isPasswordCorrect = bcrypt.compareSync(
            req.body.password, user.hashedPassword
        );
                if (!isPasswordCorrect) {
            return res.status(401).json({error: 'invalid credentials'})
        };         const payload = {
            username: user.username,
            _id : user._id
        };
        const token = jwt.sign(
            { payload },
            process.env.JWT_SECRET
        )
        res.status(200).json({ token });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'error: '})
    }
})

module.exports = router;