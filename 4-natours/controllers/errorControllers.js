const AppError = require('../utils/appError');

const handleCastErrorDB = err=>{
    const message = `Invalid ${err.path}: ${err.value}`;

    return new AppError(message,400);
}

const handleDublicateErrorDB = err=>{
    const value = err.keyValue ? Object.values(err.keyValue)[0] : '';
  
    const message = `Duplicate field value: "${value}". Please use another value!`;
    
    return new AppError(message, 400);
}

const handleValidationErrorDB = err=>{
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid inut data. ${errors.join('. ')}`;
    return new AppError(message,400);
}

const handleJWTError = err=>{
    return new AppError('Invalid token please login again.',401);
}

const handleJWTExpiredError = err=>{
    return new AppError('Your token has expired. Please login again.',401)
}

const sendErrorDev  = (err,res)=>{
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
}

const sendErrorProd = (err,res)=>{
    // Opertational error , trusted error
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }
    //Programming  or other error:  don't leak the details to the client
    else{
        console.error('Error: ',err);
        res.status(500).json({
            status: 'fail',
            message: 'Something went wrong!'
        })
    }
}

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'err';
    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err,res);
    }else if(process.env.NODE_ENV === 'production'){
        let error = { ...err };
        error.message = err.message;
        error.name = err.name;
        error.code = err.code;

        if(error.name === 'CastError') error = handleCastErrorDB(error);
        if(error.code === 11000) error = handleDublicateErrorDB(error);
        if(error.name == 'ValidationError') error = handleValidationErrorDB(error);
        if(error.name === 'JsonWebTokenError') error = handleJWTError(error);
        if(error.name === 'TokenExpiredError') error = handleJWTExpiredError(error);
        sendErrorProd(error, res);
    }
}