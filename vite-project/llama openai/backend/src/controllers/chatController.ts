import { Request, Response } from 'express';
import { OllamaService } from '../services/ollamaService';
import { Grade } from '../models/Grade';

const ollamaService = new OllamaService();

export const chatWithAI = async (req: Request, res: Response) => {
  try {
    const { question } = req.body;

    // แยกข้อมูลจากคำถาม
    const parts = question.trim().split(' ');
    
    // ตรวจสอบรูปแบบข้อมูล
    const studentIdPattern = /^\d+$/;
    const termYearPattern = /(\d)\/(\d{4})/;

    // ค้นหารหัสนักศึกษาและเทอม/ปี
    const studentId = parts.find(part => studentIdPattern.test(part));
    const termYear = parts.find(part => termYearPattern.test(part));

    // ถ้าไม่มี studentId ให้ส่งคำถามไปที่ Ollama โดยตรง
    if (!studentId) {
      const aiResponse = await ollamaService.generateResponse(question, []);
      return res.json({ answer: aiResponse });
    }

    // สร้าง query filter สำหรับค้นหาเกรด
    let queryFilter: any = { studentId: studentId };

    if (termYear) {
      const [_, semester, year] = termYear.match(termYearPattern) || [];
      queryFilter.semester = semester;
      queryFilter.academicYear = year;
    }

    // ค้นหาเกรดที่ตรงกับเงื่อนไข
    const grades = await Grade.find(queryFilter);
    
    if (grades.length === 0) {
      return res.json({ answer: "No grades found for this student ID." });
    }

    const aiResponse = await ollamaService.generateResponse(question, grades);
    return res.json({ answer: aiResponse });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}; 