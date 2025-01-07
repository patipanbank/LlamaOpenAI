import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema({
  academicYear: String,
  semester: String,
  subject: String,
  studentId: String,
  name: String,
  score: Number,
  grade: String,
  createdAt: Date,
  updatedAt: Date,
  __v: Number
});

export const Grade = mongoose.model('Grade', gradeSchema); 