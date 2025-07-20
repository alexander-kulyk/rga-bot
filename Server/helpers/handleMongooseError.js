const handleMongooseError = (error, data, next) => {
  const { name, code } = error;
  const statusCode = name === 'MongoServerError' && code === 11000 ? 409 : 400; // Conflict for duplicate key error
  const message =
    name === 'MongoServerError' && code === 11000
      ? `This ${Object.keys(error.keyValue)[0]} is already in use`
      : error.message;
  error.status = statusCode;
  error.message = message;
  next(error);
};

export default handleMongooseError;
