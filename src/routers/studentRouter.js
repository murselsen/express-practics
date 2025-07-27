import { Router } from 'express';
import {
  createStudentController,
  getAllStudentsController,
  getStudentByIdController,
} from '../controllers/studentController.js';

const studentRouter = Router();
studentRouter.use((req, res, next) => {
  next();
});
studentRouter.get('/', getAllStudentsController);

studentRouter.get('/:studentId', getStudentByIdController);

studentRouter.post('/', createStudentController);

export default studentRouter;
