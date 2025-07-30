import { Router } from 'express';
import {
  createStudentController,
  deleteStudentController,
  getAllStudentsController,
  getStudentByIdController,
  updateStudentController,
} from '../controllers/studentController.js';

const studentRouter = Router();

// Tüm Öğrencileri Getir
studentRouter.get('/', getAllStudentsController);

// Öğrenci ID'sine Göre Öğrenci Getir
studentRouter.get('/:studentId', getStudentByIdController);

// Yeni Öğrenci Oluştur
studentRouter.post('/', createStudentController);

// Öğrenci Sil
studentRouter.delete('/:studentId', deleteStudentController);

studentRouter.put('/:studentId', updateStudentController);

export default studentRouter;
