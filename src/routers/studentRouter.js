import { Router } from 'express';
import {
  createStudentController,
  deleteStudentController,
  getAllStudentsController,
  getStudentByIdController,
} from '../controllers/studentController.js';

import validateParams from '../middlewares/validateParams.js';

const studentRouter = Router();

studentRouter.get('/', getAllStudentsController);

studentRouter.get('/:studentId', [validateParams, getStudentByIdController]);

studentRouter.post('/', createStudentController);

// studentRouter.delete('/:studentId');
studentRouter.delete('/:studentId', [validateParams, deleteStudentController]);

export default studentRouter;
