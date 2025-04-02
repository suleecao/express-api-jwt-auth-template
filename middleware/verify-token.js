//18 require middleware library
const jwt = require('jsonwebtoken');


//18b all middleware have these params
//very similar to 17 JWT test module
function verifyToken(req, res, next) {
    try {
            const token = req.headers.authorization.split(' ')[1];
            //pass in token, pass in JWT_SECRET
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded.payload // 18C this adds the user obj to req.user
            next(); //18D invoke or the request will stall
        } catch (error) {       
            res.status(401).json({ error: 'invalid token' });
        }
    }

//18E export, go to controllers/users.js
module.exports = verifyToken;
