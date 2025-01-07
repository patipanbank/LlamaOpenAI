import { Request, Response } from 'express';
import { Grade } from '../models/Grade';

export const saveGrades = async (req: Request, res: Response) => {
  try {
    const grades = req.body;
    console.log('Received grades:', grades);

    if (!Array.isArray(grades) || grades.length === 0) {
      console.log('Invalid grades data');
      return res.status(400).json({ error: 'Invalid grades data' });
    }

    // ตรวจสอบววามถูกต้องของข้อมูล
    const isValidData = grades.every(grade => 
      grade.academicYear && 
      grade.semester && 
      grade.subject && 
      grade.studentId && 
      grade.name && 
      typeof grade.score === 'number' && 
      grade.grade
    );

    if (!isValidData) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // บร้างอาเรย์สำหรับเก็บผลลัพธ์
    const results = [];

    // ประมวลผลแต่ละเกรด
    for (const grade of grades) {
      // ค้นหาข้อมูลที่มีอยู่แล้ว
      const existingGrade = await Grade.findOne({
        academicYear: grade.academicYear,
        semester: grade.semester,
        subject: grade.subject,
        studentId: grade.studentId
      });

      if (existingGrade) {
        // ถ้ามีข้อมูลอยู่แล้ว ให้อัพเดท
        const updatedGrade = await Grade.findByIdAndUpdate(
          existingGrade._id,
          {
            name: grade.name,
            score: grade.score,
            grade: grade.grade
          },
          { new: true } // ส่งข้อมูลที่อัพเดทแล้วกลับมา
        );
        results.push({ ...updatedGrade?.toObject(), status: 'updated' });
      } else {
        // ถ้าไม่มีข้อมูล ให้สร้างใหม่
        const newGrade = await Grade.create(grade);
        results.push({ ...newGrade.toObject(), status: 'created' });
      }
    }

    console.log('Operation results:', results);
    
    // ส่งผลลัพธ์กลับไป
    res.status(200).json({
      message: 'Grades processed successfully',
      results: results
    });

  } catch (error) {
    console.error('Error processing grades:', error);
    res.status(500).json({ 
      error: 'Error processing grades',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 