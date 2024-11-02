class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}

const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    return {
      message: error.response.data.message || 'Something went wrong',
      statusCode: error.response.status
    };
  } else if (error.request) {
    // Request made but no response
    return {
      message: 'Unable to connect to server',
      statusCode: 503
    };
  } else {
    // Error in request setup
    return {
      message: error.message || 'An unexpected error occurred',
      statusCode: 500
    };
  }
};


export { AppError, handleApiError };
