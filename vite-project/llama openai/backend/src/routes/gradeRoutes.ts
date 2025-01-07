import express from 'express';
import { saveGrades } from '../controllers/gradeController';
import { handleChat } from '../controllers/chatController';

const router = express.Router();

router.post('/grades', saveGrades);
router.post('/chat', handleChat);

export default router; 