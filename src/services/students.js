import { isValidObjectId } from 'mongoose';

import StudentsCollection from '../db/models/students.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

import { SORT_ORDER } from '../constants/index.js';

export const getAllStudents = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const studentsQuery = StudentsCollection.find();
  console.log('Filter parameters:', filter);
  // Filters
  if (filter.gender) {
    // eq: eşit
    studentsQuery.where('gender').in(filter.gender);
  }
  if (filter.minAge) {
    // gte : büyük veya eşit
    studentsQuery.where('age').gte(filter.minAge);
  }
  if (filter.maxAge) {
    // lte : küçük veya eşit
    studentsQuery.where('age').lte(filter.maxAge);
    console.log(`Filtering by maxAge: ${filter.maxAge}`);
  }
  if (filter.minAvgMark) {
    // gte : büyük veya eşit
    studentsQuery.where('avgMark').gte(filter.minAvgMark);
  }
  if (filter.maxAvgMark) {
    // lte : küçük veya eşit
    studentsQuery.where('avgMark').lte(filter.maxAvgMark);
  }

  console.log(`Fetching students with limit: ${limit}, skip: ${skip}`);

  const [studentsCount, students] = await Promise.all([
    StudentsCollection.find().merge(studentsQuery).countDocuments(),
    studentsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(studentsCount, perPage, page);
  return {
    students,
    ...paginationData,
  };
};

export const getStudentById = async (id) => {
  if (!isValidObjectId(id)) return null;

  console.log(`ID: ${id} Typeof ID: ${typeof id}`);
  const student = await StudentsCollection.findById(id);
  if (!student) {
    return null;
  }
  return student;
};
// This function is used to find a student by their name
export const getStudentByName = async (name) => {
  const student = await StudentsCollection.findOne({ name: name });
  if (!student) {
    return null;
  }
  return student;
};

export const isStudentExists = async (name) => {
  const result = await getStudentByName(name);
  if (!result) {
    return false;
  }
  return true;
};

export const createStudent = async (studentData) => {
  const newStudent = await StudentsCollection.create(studentData);
  return newStudent;
};

export const deleteStudent = async (id) => {
  if (!isValidObjectId(id)) return null;

  const student = await getStudentById(id);
  if (!student) {
    return null;
  }
  await StudentsCollection.findByIdAndDelete(id);
  return true;
};

export const updateStudent = async (id, studentData, options = {}) => {
  if (!isValidObjectId(id)) return null;

  const rawResult = await StudentsCollection.findOneAndUpdate(
    { _id: id },
    studentData,
    {
      new: true, // Güncellenmiş veriyi döndür
      includeResultMetadata: true, // Sonuç metadata'sını dahil et
      ...options, // Ekstra seçenekler
    }
  );
  console.log('Raw result:', rawResult);
  if (!rawResult) {
    return null;
  }
  return rawResult;
};
