import { createResponse } from '../utils/createResponse.js';

const validateParams = (req, res, next) => {
  console.log('Validating request parameters:', req.params);
  const params = Object.entries(req.params);
  params.forEach(([key, value]) => {
    console.log(`Parameter: ${key}, Value: ${value}`);
  });
  if (params.length === 0) {
    return res
      .status(422)
      .json(
        createResponse(
          false,
          'No parameters provided',
          null,
          422,
          'MISSING_PARAMETERS'
        )
      );
  }
  next();
};

export default validateParams;
