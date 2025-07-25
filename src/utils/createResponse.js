export const createResponse = (
  success = true,
  message = "",
  data = null,
  statusCode = 200,
  errorCode = null,
) => {
  const result = {
    timestamp: new Date().toISOString(),
    success,
    errorCode,
    statusCode,
    message,
    data,
  };
  console.log("Response created:", result);
  return result;
};
