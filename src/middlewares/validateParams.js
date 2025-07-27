import { createResponse } from '../utils/createResponse';

const validateParams = (req, res, next) => {
  console.log('Validating request parameters:', req.params);
  const params = Object.entries(req.params);

  console.log('Request parameters:', params);
  if (params.length === 0) {
    console.warn('No parameters provided in the request');
    return res
      .status(422)
      .json(createResponse(false, 'No parameters provided', null, 422, 'MISSING_PARAMETERS'));
  }
  next();
};

export default validateParams;
