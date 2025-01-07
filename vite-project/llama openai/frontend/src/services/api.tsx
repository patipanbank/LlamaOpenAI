import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

interface Grade {
  academicYear: string;
  semester: string;
  subject: string;
  studentId: string;
  name: string;
  score: number;
  grade: string;
}

export const saveGrades = async (grades: Grade[]) => {
  try {
    const response = await axios.post(`${API_URL}/grades`, grades);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Error saving grades');
  }
};

export const fetchGrades = async (params: {
  academicYear?: string;
  semester?: string;
  subject?: string;
}) => {
  try {
    const response = await axios.get(`${API_URL}/grades`, { params });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Error fetching grades');
  }
};