export const createResponse = (
  success = true,
  message = "",
  data = null,
  statusCode = 200,
  errorCode = null
) => {
  const result = {
    success,
    message,
    data,
    errorCode,
    statusCode,
    timestamp: new Date().toISOString(),
  };
  console.log("Response created:", result);
  return result;
};
