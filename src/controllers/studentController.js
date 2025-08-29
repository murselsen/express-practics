import {
  getAllStudents,
  getStudentById,
  isStudentExists,
  createStudent,
  updateStudent,
} from '../services/students.js';
import { createResponse } from '../utils/createResponse.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import createHttpError from 'http-errors';
import saveFile from '../utils/saveFile.js';

// Controllers
// Get all students
export const getAllStudentsController = async (req, res, next) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);
    const students = await getAllStudents({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
    });
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
  try {
    const { studentId } = req.params;
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

  try {
    const body = req.body;
    if (!body) throw createHttpError(400, 'Request body is missing');

    const isStudentExistsResult = await isStudentExists(body.name);
    if (isStudentExistsResult) {
      throw createHttpError(409, 'Student with this name already exists');
    }
    console.log('Creating new student with data:', body);

      let photo;

      if (req.file) { 
        photo = await saveFile(req.file);
      }

      
    await createStudent({photo ,...body});
    res
      .status(201)
      .json(createResponse(true, 'Student created successfully', body, 201));
  } catch (error) {
    next(error);
  }
};

export const deleteStudentController = async (req, res, next) => {
  try {
    await deleteStudent(studentId);
    res
      .status(200)
      .json(createResponse(true, 'Student is deleted successfully', null, 204));
  } catch (error) {
    next(error);
  }
};

export const upsertStudentController = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const studentData = req.body;

    const result = await updateStudent(studentId, studentData, {
      upsert: true, // Eğer öğrenci yoksa yeni bir tane oluştur
    });
    if (!result) {
      throw createHttpError(404, 'Student not found');
    }

    const statusCode = result.isNew ? 201 : 200;
    res
      .status(statusCode)
      .json(
        createResponse(
          true,
          'Student upsert a successfully',
          result,
          statusCode
        )
      );
  } catch (error) {
    next(error);
  }
};

export const patchStudentController = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const studentData = req.body;
    const photo = req.file;

    let photoUrl;

    if (photo) {
      photoUrl = await saveFile(photo);
      console.log('Photo URL:', photoUrl);
    }

    const result = await updateStudent(studentId, {
      studentData,
      photo: photoUrl,
    });
    if (!result) {
      throw createHttpError(404, 'Student not found');
    }

    res
      .status(200)
      .json(createResponse(true, 'Student updated successfully', result, 200));
  } catch (error) {
    next(error);
  }
};
