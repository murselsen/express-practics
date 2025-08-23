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

// Users Roles Middleware
import { checkRoles } from '../middlewares/checkRoles.js';
// User Roles
import { ROLES } from '../constants/index.js';

const studentRouter = Router();

// Tüm Öğrencileri Getir | Sadece Öğretmen Erişebilir
studentRouter.get('/', checkRoles(ROLES.TEACHER), getAllStudentsController);

// Öğrenci ID'sine Göre Öğrenci Getir
studentRouter.get(
  '/:studentId',
  checkRoles(ROLES.TEACHER, ROLES.PARENT),
  isValidId,
  getStudentByIdController
);

// Yeni Öğrenci Oluştur
studentRouter.post(
  '/',
  checkRoles(ROLES.TEACHER),
  validateBody(createStudentSchema),
  createStudentController
);

// Öğrenci Sil
studentRouter.delete(
  '/:studentId',
  checkRoles(ROLES.TEACHER),
  isValidId,
  deleteStudentController
);

// Öğrenci Güncelle (Tamamen Değiştir)
studentRouter.put(
  '/:studentId',
  checkRoles(ROLES.TEACHER),
  isValidId,
  upsertStudentController
);

// Öğrenci Kısmi Güncelle
//
studentRouter.patch(
  '/:studentId',
  checkRoles(ROLES.TEACHER, ROLES.PARENT),
  isValidId,
  validateBody(updateStudentSchema),
  patchStudentController
);

export default studentRouter;
