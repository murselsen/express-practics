import { createResponse } from '../utils/createResponse.js';

const serverErrorMiddleware = (err, req, res, next) => {
  console.error('Internal Server Error:');
  console.error(err);
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
