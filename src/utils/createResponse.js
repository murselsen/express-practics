export const createResponse = (
  success = true,
  message = '',
  data = null,
  statusCode = 200,
  errorCode = null
) => {
  const result = {
    success,
    timestamp: new Date().toISOString(),
    statusCode,
    message,
    errorCode,
    data,
  };
  // console.log("Response created:", result);
  return result;
};
