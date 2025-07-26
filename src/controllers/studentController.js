import { getAllStudents, getStudentById } from '../services/students.js';
import { createResponse } from '../utils/createResponse.js';
import createHttpError from 'http-errors';

// Controllers
// Get all students
export const getAllStudentsController = async (req, res, next) => {
  try {
    const students = await getAllStudents();
    if (!students || students.length === 0) {
      throw createHttpError(404, 'No students found');
    }
    res
      .status(200)
      .json(
        createResponse(true, 'Students fetched successfully', students, 200)
      );
  } catch (error) {
    next(error);
  }
};

export const getStudentByIdController = async (req, res, next) => {
  const { studentId } = req.params;
  try {
    const student = await getStudentById(studentId);
    if (!student) {
      throw createHttpError(404, 'Student not found');
    }
    res
      .status(200)
      .json(createResponse(true, 'Student fetched successfully', student, 200));
  } catch (error) {
    next(error);
  }
};

export const createStudentController = async (req, res) => {
  console.log('POST request to /students', req.body);

  const body = req.body;
  if (!body) {
    throw createHttpError(404, 'Request body is missing');
  }
  res.status(200).json({
    message: 'This endpoint is not implemented yet',
    data: req.body,
  });
};
