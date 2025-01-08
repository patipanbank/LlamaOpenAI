import axios from 'axios';

export class OllamaService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'http://localhost:11434/api/generate';
  }

  async generateResponse(question: string, gradeData: any) {
    try {
      let prompt;
      
      if (!gradeData || gradeData.length === 0) {
        // ถ้าไม่มีข้อมูลเกรด ส่งคำถามไปตรงๆ
        prompt = `Question: ${question}\n\nPlease provide a helpful response:`;
      } else {
        // ถ้ามีข้อมูลเกรด จัดรูปแบบข้อมูลเหมือนเดิม
        const formattedResponse = `Student: ${gradeData[0].name} (ID: ${gradeData[0].studentId})\n\n` +
          gradeData.map((grade: any) => 
            `Subject: ${grade.subject}\n` +
            `Grade: ${grade.grade} (${grade.score})\n` +
            `Term: ${grade.semester}/${grade.academicYear}`
          ).join('\n\n');

        prompt = `Based on this student's grade information:\n\n${formattedResponse}\n\nQuestion: ${question}\n\nPlease provide a helpful response:`;
      }

      const response = await axios.post(this.baseUrl, {
        model: 'llama2',
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          repeat_penalty: 1.5,
          stop: ["\n\n\n"]
        }
      });

      return response.data.response;

    } catch (error) {
      console.error('Error calling Ollama:', error);
      throw error;
    }
  }
} 