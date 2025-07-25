export const createResponse = (
  success = true,
  message = "",
  data = null,
  statusCode = 200,
  errorCode = null,
) => {
  const result = {
    timestamp: new Date().toISOString(),
    errorCode,
    statusCode,
    success,
    message,
    data,
  };
  console.log("Response created:", result);
  return result;
};
