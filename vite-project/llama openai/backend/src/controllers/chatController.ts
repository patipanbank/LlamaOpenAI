import { Request, Response } from 'express';
import { Grade } from '../models/Grade';

export const handleChat = async (req: Request, res: Response) => {
  try {
    const { question } = req.body;

    // ถ้าไม่มีคำถาม แสดงคำแนะนำ
    if (!question || question.trim() === '') {
      const welcomeMessage = `
I can help you search for student grades using these 4 formats:

1. Subject + Student ID + Term/Year
   Example: "Math 6412345678 1/2024"

2. Student ID + Term/Year
   Example: "6412345678 1/2024"

3. Subject + Student Name + Term/Year
   Example: "Math John 1/2024"

4. Student Name + Term/Year
   Example: "John 1/2024"

Please type your search query using one of these formats.
Note: Term/Year should always be in the format "semester/year" (e.g., 1/2024)`;

      return res.json({ answer: welcomeMessage });
    }

    // แยกข้อมูลจากคำถาม
    const parts = question.trim().split(' ');
    let queryFilter: any = {};

    // ครวจสอบรูปแบบข้อมูลที่เป็นไปได้
    const studentIdPattern = /^\d{10}$/;
    const termYearPattern = /(\d)\/(\d{4})/;
    const namePattern = /^[A-Za-zก-๙\s]+$/;

    // ค้นหาเทอม/ปี (จะอยู่ท้ายสุดเสมอ)
    const termYear = parts[parts.length - 1];
    if (!termYearPattern.test(termYear)) {
      return res.json({ 
        answer: "Invalid format. Term/Year must be in format 'semester/year' (e.g., 1/2024)" 
      });
    }

    const [_, semester, year] = termYear.match(termYearPattern) || [];
    queryFilter.semester = semester;
    queryFilter.academicYear = year;
    parts.pop(); // ลบส่วนเทอม/ปีออก

    // ตรวจสอบรูปแบบการค้นหา
    if (parts.length === 2) {
      // รูปแบบที่ 1: วิชา + รหัสนักศึกษา
      if (studentIdPattern.test(parts[1])) {
        queryFilter.subject = new RegExp(parts[0], 'i');
        queryFilter.studentId = parts[1];
      }
      // รูปแบบที่ 3: วิชา + ชื่อ
      else if (namePattern.test(parts[1])) {
        queryFilter.subject = new RegExp(parts[0], 'i');
        queryFilter.name = new RegExp(parts[1], 'i');
      }
    } else if (parts.length === 1) {
      // รูปแบบที่ 2: รหัสนักศึกษา
      if (studentIdPattern.test(parts[0])) {
        queryFilter.studentId = parts[0];
      }
      // รูปแบบที่ 4: ชื่อ
      else if (namePattern.test(parts[0])) {
        queryFilter.name = new RegExp(parts[0], 'i');
      }
    }

    console.log('Query filter:', queryFilter);
    const grades = await Grade.find(queryFilter).sort({ subject: 1 });

    if (grades.length === 0) {
      return res.json({ 
        answer: "No grades found for your search criteria. Please check your input and try again." 
      });
    }

    // จัดรูปแบบตาราง
    const formatTableData = (grades: any[]) => {
      
      const rows = grades.map(grade => 
        `| ${grade.subject.padEnd(7)} | ${grade.studentId} | ${grade.name.padEnd(4)} | ` +
        `${String(grade.score).padEnd(5)} | ${grade.grade.padEnd(5)} | ` +
        `${grade.semester.padEnd(8)} | ${grade.academicYear.padEnd(13)} |`
      );

      return [ ...rows].join('\n');
    };

    const formattedData = formatTableData(grades);
    res.json({ answer: formattedData });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Error processing chat request',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 