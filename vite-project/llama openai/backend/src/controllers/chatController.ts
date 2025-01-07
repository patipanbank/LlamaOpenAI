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
    
    if (!studentId) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }

    // สร้าง query filter
    let queryFilter: any = { studentId: studentId };

    // ถ้ามีข้อมูลเทอม/ปี ให้เพิ่มในการค้นหา
    if (termYear) {
      const [_, semester, year] = termYear.match(termYearPattern) || [];
      queryFilter.semester = semester;
      queryFilter.academicYear = year;
    }

    console.log('Query filter:', queryFilter);

    // ค้นหาเกรดที่ตรงกับเงื่อนไข
    const grades = await Grade.find(queryFilter);
    
    if (grades.length === 0) {
      return res.json({ answer: "No grades found for this student ID." });
    }

    console.log('Found grades:', grades);

    const aiResponse = await ollamaService.generateResponse(question, grades);
    
    return res.json({ answer: aiResponse });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}; 