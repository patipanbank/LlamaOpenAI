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
        prompt = `Question: ${question}\n\nPlease provide a helpful response:`;
      } else {
        const formattedResponse = `
📋 Student Information
━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Name: ${gradeData[0].name}
🆔 Student ID: ${gradeData[0].studentId}

📊 Grade Report (${gradeData[0].semester}/${gradeData[0].academicYear})
━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          gradeData.map((grade: any) => 
            `📚 ${grade.subject.padEnd(20)} : ${grade.grade} (${grade.score})`
          ).join('\n');

        prompt = `You are a grade reporting assistant. Based on this information:

${formattedResponse}

Question: ${question}

Please provide a clear and concise response focusing on the grade information. Avoid repeating the same information multiple times.`;
      }

      const response = await axios.post(this.baseUrl, {
        model: 'llama2',
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.5,
          top_p: 0.9,
          repeat_penalty: 1.8,
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