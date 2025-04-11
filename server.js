const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');
const PORT = process.env.PORT || 3000;
const authRouter = require('./controllers/auth');
const testJwtRouter = require('./controllers/test-jwt');
const usersRouter = require('./controllers/users');
const cocktailsRouter = require('./controllers/cocktails');
const reviewsRouter = require("./controllers/reviews");
const ingredientRoutes = require("./controllers/ingredients")
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(cors());
app.use(express.json());
app.use(logger('dev'));

app.use('/auth', authRouter);
app.use('/test-jwt', testJwtRouter);
app.use('/users', usersRouter);
app.use("/cocktails", cocktailsRouter);
app.use("/reviews", reviewsRouter)
app.use('/ingredients', ingredientRoutes)

app.listen(PORT, () => {
  console.log('The express app is ready!');
});
