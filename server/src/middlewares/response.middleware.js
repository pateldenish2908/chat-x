exports.successResponse = (res, data = {}, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

exports.errorResponse = (res, error = {}, message = 'Something went wrong', statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};

exports.validationErrorResponse = (res, errors = [], message = 'Validation Error', statusCode = 422) => {
  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};