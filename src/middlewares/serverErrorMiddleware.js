import { createResponse } from '../utils/createResponse.js';
import { HttpError } from 'http-errors';

const serverErrorMiddleware = (err, req, res, next) => {
  console.error('Internal Server Error:');
  console.error(err);
  if (err instanceof HttpError) {
    res
      .status(err.status)
      .json(
        createResponse(
          false,
          err.message || 'An error occurred',
          null,
          err.status,
          err.code || 'HTTP_ERROR'
        )
      );
    return;
  }
  res
    .status(500)
    .json(
      createResponse(
        false,
        err.message || 'Internal Server Error',
        null,
        500,
        'INTERNAL_SERVER_ERROR'
      )
    );
};

export default serverErrorMiddleware;
