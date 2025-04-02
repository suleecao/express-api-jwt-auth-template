const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');
//step 2a
const testJwtRouter = require('./controllers/test-jwt');
//step 9D
const authRouter = require('./controllers/auth');
//19D require
const usersRouter = require('./controllers/users');
//23 put middleware here instead instead of route definitions
const verifyToken = require('./middleware/verify-token');


mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(cors());
app.use(express.json());
app.use(logger('dev'));

//step 10 routes below, check postman then install bcrypt in terminal
app.use('/auth', authRouter);
//19E invoke 23B put verifyToken here
app.use('/users', verifyToken, usersRouter);
//step 2b, go to postman after this
app.use('/test-jwt', testJwtRouter);




app.listen(3000, () => {
  console.log('The express app is ready!');
});
