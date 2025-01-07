import express from 'express';
import { saveGrades } from '../controllers/gradeController';
import { chatWithAI } from '../controllers/chatController';

const router = express.Router();

router.post('/grades', saveGrades);
router.post('/chat', chatWithAI);

export default router; 