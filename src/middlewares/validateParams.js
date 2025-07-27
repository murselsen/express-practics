import { createResponse } from '../utils/createResponse.js';

const validateParams = (req, res, next) => {
  console.log('Validating request parameters:', req.params);
  const params = Object.entries(req.params);

  let errorMessage = '';
  params.forEach(([key, value]) => {
    console.log(`Parameter: ${key}, Value: ${value}`);
    value = String(value)?.trim();
    if (value === '') {
      errorMessage += `Parameter ${key} is missing.\n`;
    }
  });

  if (errorMessage === '') {
    next();
  } else {
    res
      .status(422)
      .json(
        createResponse(
          false,
          errorMessage || 'Missing required parameters',
          null,
          422,
          'MISSING_PARAMETERS'
        )
      );
  }
};

export default validateParams;
