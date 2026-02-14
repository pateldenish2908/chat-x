// Success response
exports.successResponse = (res, data = {}, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// Error response
exports.errorResponse = (res, message = 'Error', statusCode = 500, error) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};
