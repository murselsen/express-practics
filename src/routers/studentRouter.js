import { Router } from 'express';
import {
  createStudentController,
  deleteStudentController,
  getAllStudentsController,
  getStudentByIdController,
  upsertStudentController,
  patchStudentController,
} from '../controllers/studentController.js';

import {
  createStudentSchema,
  updateStudentSchema,
} from '../validation/student.js';

import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';

const studentRouter = Router();

// Tüm Öğrencileri Getir
studentRouter.get('/', getAllStudentsController);

// Öğrenci ID'sine Göre Öğrenci Getir
studentRouter.get('/:studentId', isValidId, getStudentByIdController);

// Yeni Öğrenci Oluştur
studentRouter.post(
  '/',
  validateBody(createStudentSchema),
  createStudentController
);

// Öğrenci Sil
studentRouter.delete('/:studentId', isValidId, deleteStudentController);

studentRouter.put('/:studentId', isValidId, upsertStudentController);
studentRouter.patch(
  '/:studentId',
  isValidId,
  validateBody(updateStudentSchema),
  patchStudentController
);

export default studentRouter;
