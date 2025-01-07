import { useState } from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import * as XLSX from 'xlsx';
import FileUpload from './components/FileUpload';
import GradeSummary from './components/GradeSummary';
import { Settings, Subject } from './components/Settings';
import './App.css';

interface GradeData {
  summary: string;
  data: Record<string, string | number>[];
}

function App() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [gradeData, setGradeData] = useState<GradeData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (subjects.length === 0) {
      alert('Please set up subjects before uploading a file');
      return;
    }

    setLoading(true);
    try {
      const data = await readExcelFile(file);
      const summary = await analyzeGrades(data);
      setGradeData({ summary, data });
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file');
    }
    setLoading(false);
  };

  const readExcelFile = (file: File): Promise<Record<string, string | number>[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json<Record<string, string | number>>(worksheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  };

  const analyzeGrades = async (data: Record<string, string | number>[]): Promise<string> => {
    let summary = 'สรุปผลการเรียน:\n\n';

    subjects.forEach(subject => {
      const grades = data.map(student => Number(student['Score']));
      const average = grades.reduce((a, b) => a + b, 0) / grades.length;
      const letterGrade = getLetterGrade(average, subject.thresholds);
      summary += `${subject.name} เฉลี่ย: ${average.toFixed(2)} (${letterGrade})\n`;
    });

    summary += '\nคะแนนรายบุคคล:\n';
    data.forEach(student => {
      summary += `\nรหัสนักศึกษา: ${student['Student ID']}\n`;
      summary += `ชื่อ: ${student['Name']}\n`;
      summary += `คะแนน: ${student['Score']}\n`;
    });

    return summary;
  };

  const getLetterGrade = (score: number, thresholds: Subject['thresholds']): string => {
    if (score >= thresholds.A) return 'A';
    if (score >= thresholds['B+']) return 'B+';
    if (score >= thresholds.B) return 'B';
    if (score >= thresholds['C+']) return 'C+';
    if (score >= thresholds.C) return 'C';
    if (score >= thresholds['D+']) return 'D+';
    if (score >= thresholds.D) return 'D';
    return 'F';
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Grade Analysis System
        </Typography>

        <Settings subjects={subjects} onSubjectsChange={setSubjects} />
        
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <FileUpload onFileUpload={handleFileUpload} loading={loading} />
        </Paper>

        {gradeData && (
          <Paper elevation={3} sx={{ p: 3 }}>
            <GradeSummary 
              data={gradeData}
              subjects={subjects}
            />
          </Paper>
        )}
      </Box>
    </Container>
  );
}

export default App;
