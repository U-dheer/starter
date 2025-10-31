const AppError = require("../utils/appError");

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}:${err.value}.`;
    return new AppError(message, 400);
}


const handleDuplicateFieldsBDB = err => {
    const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
    console.log(value);

    const message = `Duplicate field value : ${value}. Please use another value.`;
    return new AppError(message, 400);
}


const handleValidationErrorDB = err => {

    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data.${errors.join('. ')}`;
    return new AppError(message, 400);
}

const handleJWTError = () => new AppError('Invalid token.Please log in again..', 401)

const handleJWTExpiredError = () => new AppError('Your token has expired.Please log in again', 401);

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

const sendErrorProd = (err, res) => {

    //OPERATIONAL, trusted error : send message to client
    if ('is operational', err.isOperational) {

        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })

        // PROGRAMMING OR OTHER UNKNOWN ERROR : don;t want to lead error deatails 
    } else {
        // 1) log the error
        console.error('ERROR:', err);
        // 2) send generic error message
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong'
        })
    }
}


module.exports = (err, req, res, next) => {
    // console.log(err.stack);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // const env = process.env.NODE_ENV || 'development'

    // if (env === 'development') {
    //     sendErrorDev(err, res);
    // } else if (env === 'production') {
    //     sendErrorProd(err, res);
    // }

    const env = process.env.NODE_ENV ? process.env.NODE_ENV.trim() : 'development';

    // console.log('Environment:', env);
    // console.log('Error Object:', err);


    if (env === 'development') {
        sendErrorDev(err, res);
    } else if (env === 'production') {

        // let error = err; //meka hadnna hethuwa thama argument ekakma wens krla gnna eka good pracrise ekak newe,nttm err kiyna ekm gnn thibuna
        console.log('ERROR DEATAILS', err);
        if (err.name == 'CastError') err = handleCastErrorDB(err);
        if (err.code === 11000) err = handleDuplicateFieldsBDB(err);
        if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
        if (err.name === 'JsonWebTokenError') err = handleJWTError();
        if (err.name === 'TokenExpiredError') err = handleJWTExpiredError();

        sendErrorProd(err, res)

    }

}