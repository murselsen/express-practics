import { getAllStudents, getStudentById } from '../services/students.js';
import { createResponse } from '../utils/createResponse.js';

// Controllers
// Get all students
export const getAllStudentsController = async (req, res, next) => {
  try {
    const students = await getAllStudents();
    if (!students || students.length === 0) {
      return res
        .status(404)
        .json(createResponse(false, 'No students found', null, 404));
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
    // const student = students.find((s) => s.id === Number(studentId));
    if (!student) {
      return res
        .status(404)
        .json(createResponse(false, 'Student not found', null, 404));
    }
    res
      .status(200)
      .json(createResponse(true, 'Student fetched successfully', student, 200));
  } catch (error) {
    next(error);
  }
};
