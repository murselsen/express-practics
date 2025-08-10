import { SORT_ORDER } from '../constants';

const parseSortOrder = (sortOrder) => {
  const isKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);

  if (!isKnownOrder) return SORT_ORDER.ASC;

  return sortOrder;
};

const parseSortBy = (sortBy) => {
  const keysOfStudent = [
    '_id',
    'name',
    'age',
    'gender',
    'avgMark',
    'onDuty',
    'createdAt',
    'updatedAt',
  ];

  const isKnownKey = keysOfStudent.includes(sortBy);
  if (!isKnownKey) return '_id';

  return sortBy;
};

export const parseSortParams = (query) => {
  const { sortOrder, sortBy } = query;

  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSortBy = parseSortBy(sortBy);

  return {
    sortOrder: parsedSortOrder,
    sortBy: parsedSortBy,
  };
};
