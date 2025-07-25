import { Router } from "express";
import { getAllStudents, getStudentById } from "../services/students.js";

const studentRouter = Router();
studentRouter.use((req, res, next) => {
  console.log(`Request Method: ${req.method}, Request URL: ${req.originalUrl}`);
  next();
});
studentRouter.get("/", async (req, res, next) => {
  try {
    const students = await getAllStudents();
    res.status(200).json({
      statusCode: 200,
      message: "All students fetched successfully",
      data: students,
    });
  } catch (error) {
    next(error);
  }
});

studentRouter.get("/:studentId", async (req, res, next) => {
  const { studentId } = req.params;
  try {
    const students = await getStudentById(studentId);
    // const student = students.find((s) => s.id === Number(studentId));
    if (!student) {
      return res.status(404).json({
        statusCode: 404,
        message: "Student not found",
      });
    }
    res.status(200).json({
      statusCode: 200,
      message: "Student fetched successfully",
      data: student,
    });
  } catch (error) {
    next(error);
  }
});

export default studentRouter;
