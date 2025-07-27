const validateParams = (req, res, next) => {
  console.log('Validating request parameters:', req.params);
  const params = Object.entries(req.params);

  console.log('Request parameters:', params);
  next();
};
