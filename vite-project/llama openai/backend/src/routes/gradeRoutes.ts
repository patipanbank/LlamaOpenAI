import express from 'express';
import { saveGrades } from '../controllers/gradeController';

const router = express.Router();

router.post('/grades', saveGrades);

export default router; 