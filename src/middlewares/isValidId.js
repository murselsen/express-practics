import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (req, res, next) => {
  const { studentId } = req.params;
  if (!isValidObjectId(studentId)) {
    throw createHttpError(404, 'Id is not valid');
  }
  next();
};
