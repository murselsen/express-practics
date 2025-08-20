const parseGender = (gender) => {
  const isString = typeof gender === 'string';

  if (!isString) return;

  const arrGender = [];
  const splitGender = gender.split(',');
  console.log('Slipt Gender:', splitGender);

  const isGender = (gender) => ['male', 'female', 'other'].includes(gender);
  splitGender.forEach((g) => {
    if (g !== ' ' && isGender(g)) {
      arrGender.push(g);
    }
  });

  if (arrGender.length === 0) return;

  return arrGender;
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

  const parsedGender = parseGender(gender);
  console.log('Parsed Gender:', parsedGender);

  const parsedMaxAge = parseNumber(maxAge);
  const parsedMinAge = parseNumber(minAge);
  const parsedMaxAvgMark = parseNumber(maxAvgMark);
  const parsedMinAvgMark = parseNumber(minAvgMark);

  return {
    gender: parsedGender,
    maxAge: parsedMaxAge,
    minAge: parsedMinAge,
    maxAvgMark: parsedMaxAvgMark,
    minAvgMark: parsedMinAvgMark,
  };
};
