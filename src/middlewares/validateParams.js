import { createResponse } from '../utils/createResponse.js';

const validateParams = (req, res, next) => {
  console.log('Validating request parameters:', req.params);
  const params = Object.entries(req.params);

  let errorMessage = '';
  params.forEach(([key, value]) => {
    console.log(`Parameter: ${key}, Value: ${value}`);
    if (params[key] === undefined || params[key] === null) {
      errorMessage += `Parameter ${key} is missing.\n`;
    }
  });
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

  next();
};

export default validateParams;
