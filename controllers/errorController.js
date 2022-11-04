const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  console.log(value);
  const message = `Duplicate fields value: ${value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const error = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${error.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid value, please login again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expried, please login again!', 401);

const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }

  // RENDERED WEBSITE
  console.log('Error', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // 1) API
  if (req.originalUrl.startsWith('/api')) {
    //Operational, trusted error : send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).render('error', {
        status: err.status,
        message: err.message,
      });
    }
    //Programing or other unknown error : dont leek other details
    // 1)Log error message
    console.log('Error', err);

    // 2)Send generic message
    return res.status(500).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }

  // 2) RENDERED WEBSITE
  //Operational, trusted error : send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      status: 'Something went wrong!',
      msg: err.message,
    });
  }
  //Programing or other unknown error : dont leek other details
  // 1)Log error message
  console.log('Error', err);
  // 2)Send generic message
  return res.status(500).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later',
  });
};

module.exports = (err, req, res, next) => {
  console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.create(err);
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    sendErrorProd(error, req, res);
  }
};
