import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  name: { type: String, required: true },
  subject: { type: String, required: true },
  score: { type: Number, required: true },
  grade: { type: String, required: true },
  semester: { type: String, required: true },
  academicYear: { type: String, required: true }
});

export const Grade = mongoose.model('grades', gradeSchema); 