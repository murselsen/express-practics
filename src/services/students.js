import { isValidObjectId } from "mongoose";
import StudentsCollection from "../db/models/students.js";

export const getAllStudents = async () => {
  const allStudents = await StudentsCollection.find();
  console.log("All Students:", allStudents);
  return allStudents;
};

export const getStudentById = async (id) => {
  console.log(`ID: ${id} Typeof ID: ${typeof id}`);
  const student = await StudentsCollection.findById(id);
  console.log("Student:", student);
  if (!student) {
    return [];
  }
  return student;
};
