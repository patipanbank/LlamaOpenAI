import { Request, Response } from 'express';
import { OllamaService } from '../services/ollamaService';
import { Grade } from '../models/Grade';

const ollamaService = new OllamaService();

export const chatWithAI = async (req: Request, res: Response) => {
  try {
    const { question } = req.body;

    // แยกข้อมูลจากคำถาม
    const parts = question.toLowerCase().trim().split(' ');
    
    const studentIdPattern = /^\d+$/;
    const termYearPattern = /(\d)\/(\d{4})/;

    // ค้นหารหัสนักศึกษาและเทอม/ปี
    const studentId = parts.find(part => studentIdPattern.test(part));
    const termYear = parts.find(part => termYearPattern.test(part));

    if (!studentId) {
      const aiResponse = await ollamaService.generateResponse(question, null);
      return res.json({ answer: aiResponse });
    }

    // สร้าง query filter
    let queryFilter: any = { studentId: studentId };

    if (termYear) {
      const [_, semester, year] = termYear.match(termYearPattern) || [];
      queryFilter.semester = semester;
      queryFilter.academicYear = year;
    }

    // ค้นหาเกรดจาก database
    const grades = await Grade.find(queryFilter);
    
    if (grades.length === 0) {
      return res.json({ 
        answer: "📝 No grades found for the specified criteria." 
      });
    }

    // จัดกลุ่มเกรดตาม semester และ year
    const groupedGrades = grades.reduce((acc, grade) => {
      const key = `${grade.semester}/${grade.academicYear}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(grade);
      return acc;
    }, {} as Record<string, typeof grades>);

    // สร้างข้อความตอบกลับ
    let formattedResponse = `
👤 ${grades[0].name} - Student ID #${grades[0].studentId}\n`;

    // เพิ่มข้อมูลแต่ละ semester
    for (const [termKey, termGrades] of Object.entries(groupedGrades)) {
      formattedResponse += `\n📋 Grade Report (Semester ${termKey}):
━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${
        termGrades.map(grade => 
          `📚 ${grade.subject.padEnd(20)}: ${grade.grade} (${grade.score})`
        ).join('\n')
      }\n`;
    }

    return res.json({ answer: formattedResponse });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}; 