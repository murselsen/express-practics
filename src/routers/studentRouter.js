import { Router } from 'express';
import {
  getAllStudentsController,
  getStudentByIdController,
} from '../controllers/studentController.js';

const studentRouter = Router();
studentRouter.use((req, res, next) => {
  console.log(`Request Method: ${req.method}, Request URL: ${req.originalUrl}`);
  next();
});
studentRouter.get('/', getAllStudentsController);

studentRouter.get('/:studentId', getStudentByIdController);

export default studentRouter;
