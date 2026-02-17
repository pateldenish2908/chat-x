exports.errorMiddleware = (err, req, res, next) => {
  console.error(`Error [${req.method} ${req.path}]:`, err.message || err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};


exports.notFoundMiddleware = (req, res, next) => {
  console.error(`Not Found: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    message: 'Resource not found',
  });
};