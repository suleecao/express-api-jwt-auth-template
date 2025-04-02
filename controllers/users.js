//step 19
const express = require('express');
const router = express.Router();

const User = require('../models/user');
//21
// const verifyToken = require('../middleware/verify-token'); simplify
//by removing from the routes


//19B GET, to get all users
//21B add verifyToken to the stack
router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch(error) {
        console.log(error)
        res.status(500).json({error: error.message});
    }
});
//step 22 get a single user
//22B not protected without verifyToken
router.get('/:userId', async (req, res) => {
    try{//22C if user is not 
        if(req.user._id !== req.params.userId) {
            return res.status(403).json({ error: 'not authorized' });
        }
        const user = await User.findById(req.params.userId);
        if(!user) {
            return res.status(404).json({ error: 'user not found'});
        }
        res.json({ user }); //sends 200 by default
    }catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message })
    }
});

//19C export
module.exports = router;