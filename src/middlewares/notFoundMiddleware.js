import { createResponse } from '../utils/createResponse.js';

const notFoundMiddleware = (req, res, next) => {
  res
    .status(404)
    .json(createResponse(false, 'Not Found', null, 404, 'NOT_FOUND'));
};

export default notFoundMiddleware;
