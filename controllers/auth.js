//step 9 a boilerplate
const express = require('express');
const router = express.Router();
//step 11
const bcrypt = require('bcrypt');
//step 12
const User = require('../models/user');
//step 15 jsonwebtoken requires payload and secret in the post route
const jwt = require('jsonwebtoken');

//step 13A
const saltRounds = 12;

//9c, then step 12B add async and try catch block
router.post('/sign-up', async (req, res) => {
    try{
        //13B check if un already exists, conditional logic
        const userInDatabase = await User.findOne({ username: req.body.username });
        if(userInDatabase) {
            return res.status(409).json({err: 'username in use' });
        }
        //13C create new user w/hashed pw if the above block doesn't run
        const user = await User.create({
            username: req.body.username, 
            hashedPassword: bcrypt.hashSync(req.body.password, saltRounds)
        });
        //15b payload and token, update res.status
        const payload = {
            username: user.username,
            _id: user._id
        };
        const token = jwt.sign(
            {payload},
            process.env.JWT_SECRET
        )
        //13D comment out message, render new status   15C, change from user to token below
        res.status(201).json({ token });
        // res.json({ message: 'this is the sign up route' }); 13D
    } catch (error) {
        //13E error message, then go to postman sign up page to add username test pw test , 
        res.status(500).json({ error: error.message })
    }
});

//step 16 POST sign in
router.post('/sign-in', async (req, res) => {
    try{
        //16b look up user in db and if user provided a valid username
        const user = await User.findOne({
            username: req.body.username
        });
        //16c if no user is found
        if(!user) {
            return res.status(401).json({ error: 'invalid credentials'})
        }
        //16c check if pw is correct
        const isPasswordCorrect = bcrypt.compareSync(
            req.body.password, user.hashedPassword
        );
        //16D incorrect PW
        if (!isPasswordCorrect) {
            return res.status(401).json({error: 'invalid credentials'})
        }; //17 payload, token, replace message with token on status, on to middleware
        const payload = {
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

//9b 
module.exports = router;