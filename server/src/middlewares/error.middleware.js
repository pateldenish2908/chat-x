exports.errorMiddleware = (err, req, res, next) => {
  console.error(req,next);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};


exports.notFoundMiddleware = (req, res, next) => {
  console.error(req,next);
  res.status(404).json({
    success: false,
    message: 'Resource not found',
  });
};