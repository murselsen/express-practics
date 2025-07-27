export const createResponse = (
  success = true,
  message = '',
  data = null,
  statusCode = 200,
  errorCode = null
) => {
  const result = {
    success,
    statusCode,

    message,
    timestamp: new Date().toISOString(),
  };

  if (data) {
    result['data'] = data;
  }
  if (errorCode) {
    result['error'] = errorCode;
  }

  switch (statusCode) {
    case 404:
      console.error('Error:', result);
      break;
    case 400:
      console.warn('Bad Request:', result);
      break;
    case 409:
      console.warn('Conflict:', result);
      break;
    case 422:
      console.warn('Unprocessable Entity:', result);
      break;
    case 500:
      console.error('Internal Server Error:', result);
      break;
    default:
      console.log('Success:', result);
      break;
  }
  return result;
};
