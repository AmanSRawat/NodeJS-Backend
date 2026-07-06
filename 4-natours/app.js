const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppErro = require('./utils/appError');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorControllers');

const app = express();

//Middleware
if(process.env.NODE_ENV === 'development'){
 app.use(morgan('dev'));   
}

app.set('query parser', 'extended');
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    next();
})

//Routes
app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);

app.all('*splat',(req,res,next)=>{
    next(new AppError(`Can't find ${req.originalUrl} on this server!`,404));
});

app.use(globalErrorHandler);

module.exports = app;