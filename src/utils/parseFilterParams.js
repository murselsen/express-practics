const parseGender = (gender) => {
  const isString = typeof gender === 'string';

  if (!isString) return;

  const isGender = (gender) => ['male', 'female', 'other'].includes(gender);

  if (isGender(gender)) {
    return gender;
  }
};

const parseNumber = (number) => {
  const isString = typeof number === 'string';
  if (!isString) return;

  const parsedNumber = parseInt(number);
  if (Number.isNaN(parsedNumber)) return;
  return parsedNumber;
};

export const parseFilterParams = (query) => {
  const { gender, maxAge, minAge, maxAvgMark, minAvgMark } = query;

  const parseGender = parseGender(gender);
  const parseMaxAge = parseNumber(maxAge);
  const parseMinAge = parseNumber(minAge);
  const parseMaxAvgMark = parseNumber(maxAvgMark);
  const parseMinAvgMark = parseNumber(minAvgMark);

  return {
    gender: parseGender,
    maxAge: parseMaxAge,
    minAge: parseMinAge,
    maxAvgMark: parseMaxAvgMark,
    minAvgMark: parseMinAvgMark,
  };
};
