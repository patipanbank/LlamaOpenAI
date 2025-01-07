import axios from 'axios';

export class OllamaService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'http://localhost:11434/api/generate';
  }

  async generateResponse(question: string, gradeData: any) {
    try {
      if (!gradeData || gradeData.length === 0) {
        return "No grades found for the specified criteria.";
      }

      // สร้างข้อความตี่ต้องการโดยตรง
      const formattedResponse = `Student: ${gradeData[0].name} (ID: ${gradeData[0].studentId})\n\n` +
        gradeData.map((grade: any) => 
          `Subject: ${grade.subject}\n` +
          `Grade: ${grade.grade} (${grade.score})\n` +
          `Term: ${grade.semester}/${grade.academicYear}`
        ).join('\n\n');

      // ส่งคำสั่งให้ Ollama แสดงข้อความตามที่กำหนดเท่านั้น
      const prompt = `${formattedResponse}`;

      const response = await axios.post(this.baseUrl, {
        model: 'llama2',
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.0,
          top_p: 0.1,
          repeat_penalty: 2.0,
          stop: ["\n\n\n", "Sure!", "Here", "requested"]
        }
      });

      // ส่งคืนข้อความที่สร้างเองโดยตรง แทนที่จะใช้คำตอบจาก Ollama
      return formattedResponse;

    } catch (error) {
      console.error('Error calling Ollama:', error);
      throw error;
    }
  }
} 