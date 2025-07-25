const notFoundMiddleware = (req, res, next) => {
  res.status(404).json({
    statusCode: 404,
    message: "Not found",
  });
};

export default notFoundMiddleware;
