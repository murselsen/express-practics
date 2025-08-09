export const validateBody = (schema) => async (req, res, next) => {
  try {
    console.log('Validation used schema:', schema);
    console.log('Validating request body:', req.body);
    await schema.validateAsync(req.body, {
      abortEarly: false, // Tüm hataları döndür
    });
  } catch (error) {
    next(error);
  }
};
