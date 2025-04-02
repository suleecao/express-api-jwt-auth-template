//step 1 require 2 dependencies,
const express = require('express');
const router = express.Router();
//step 4A add library
const jwt = require('jsonwebtoken');


// Routes go here
router.get('/sign-token', (req, res) => {
    //step 3 add test credentials then add jwt secret in the env file
    const user = {
        _id: 1, 
        username: 'test',
        password: 'test'
    };
    //step 4B
    const token = jwt.sign({ user }, process.env.JWT_SECRET);
    //step 4c replace authorized message 'you are authorized' in json with token
    res.json({ token });
});


//step 5, then go to Postman
router.post('/verify-token', (req, res) => {
    //step 6, comment out message about token being valid , 6b .split 6c back to Postman
    //this breaks out the token, removing the bearer
    const token = req.headers.authorization.split(' ')[1];
    //step 7
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 7b, comment out {token}, replace with {decoded}
    res.json({ decoded });
    // res.json({ token})
    // res.json({ message: 'token is valid'});
});

module.exports = router;

//get token token from the get request, paste it in the post tab in postman