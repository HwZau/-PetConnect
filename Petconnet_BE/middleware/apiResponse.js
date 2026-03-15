// Helper middleware to normalize API responses in a consistent format (similar to .NET ApiResponse<T>)

function apiResponseMiddleware(req, res, next) {
  res.apiSuccess = function (data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      statusCode,
      isSuccess: true,
      message,
      data
    });
  };

  res.apiError = function (message = 'Error', statusCode = 500, data = null) {
    return res.status(statusCode).json({
      statusCode,
      isSuccess: false,
      message,
      data
    });
  };

  next();
}

module.exports = apiResponseMiddleware;
