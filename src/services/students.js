import { isValidObjectId } from 'mongoose';
import StudentsCollection from '../db/models/students.js';

export const getAllStudents = async () => {
  const allStudents = await StudentsCollection.find();
  console.log('All Students:', allStudents);
  return allStudents;
};

export const getStudentById = async (id) => {
  console.log(`ID: ${id} Typeof ID: ${typeof id}`);
  const student = await StudentsCollection.findById(id);
  console.log('Student:', student);
  if (!student) {
    return [];
  }
  return student;
};
// öğrenci e-posta ile kontrolü var mı
export const getStudentByName = async (name) => {
  const student = await StudentsCollection.findOne({ name: name });
  console.log('Student by Name:', student);
  if (!student) {
    return false;
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
  console.log('Creating student with data:', studentData);
  const newStudent = await StudentsCollection.create(studentData);
  console.log('New Student Created:', newStudent);
  return newStudent;
};

export const deleteStudent = async (id) => {
  const student = await getStudentById(id);
  if (!student) {
    console.log(`Student with ID ${id} not found.`);
    return false;
  }
  await StudentsCollection.findByIdAndDelete(id);
  console.log(`Student with ID ${id} deleted successfully.`);
  return true;
};
