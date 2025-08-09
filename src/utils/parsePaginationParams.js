import { parseNumber } from './parseNumber.js';

// Bu fonksiyon, sorgu nesnesinden sayfalama parametrelerini ayrıştırır.
// Sayfa ve perPage değerlerini içeren bir nesne döndürür, varsayılan olarak 1 ve
export const parsePaginationParams = (query) => {
  const { page, perPage } = query;

  const parsedPage = parseNumber(page, 1);
  const parsedPerPage = parseNumber(perPage, 10);

  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};
