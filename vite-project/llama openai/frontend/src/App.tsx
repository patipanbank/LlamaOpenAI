import { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Drawer, Button, Divider, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';  // For the hamburger menu
import * as XLSX from 'xlsx';
import FileUpload from './components/FileUpload';
import GradeSummary from './components/GradeSummary';
import { Settings, Subject } from './components/Settings';
import Chatbot from './components/ChatComponent.tsx';
import './App.css';
import { saveGrades } from './services/api.tsx';

// Define the GradeData interface
interface GradeData {
  summary: string;
  data: Record<string, string | number>[]; // Array of student data with dynamic keys (student info)
}

// Define the Grade interface
interface Grade {
  academicYear: string;
  semester: string;
  subject: string;
  studentId: string;
  name: string;
  score: number;
}

function App() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [gradeData, setGradeData] = useState<GradeData | null>(null); // This uses the GradeData interface
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'grades' | 'chat'>('grades');
  const [gradesToSave, setGradesToSave] = useState<Grade[]>([]);

  // เพิ่มฟังก์ชันคำนวณเกรด
  const calculateGrade = (score: number, thresholds: any): string => {
    if (score >= thresholds.A) return 'A';
    if (score >= thresholds['B+']) return 'B+';
    if (score >= thresholds.B) return 'B';
    if (score >= thresholds['C+']) return 'C+';
    if (score >= thresholds.C) return 'C';
    if (score >= thresholds['D+']) return 'D+';
    if (score >= thresholds.D) return 'D';
    return 'F';
  };

  // แก้ไข useEffect
  useEffect(() => {
    if (gradeData && subjects.length > 0) {
      const currentSubject = subjects[0];
      
      // อัพเดทข้อมูลด้วย subject ใหม่และคำนวณเกรด
      const updatedGrades = gradeData.data.map(student => {
        // แก้ไขการดึงค่าคะแนน - ดึงเฉพาะตัวเลขคะแนน
        let score: number;
        const scoreStr = student['Score'].toString();
        if (scoreStr.includes('(')) {
          // ถ้ามีวงเล็บ (มีเกรด) ให้ดึงเฉพาะตัวเลขก่อนวงเล็บ
          score = Number(scoreStr.split(' ')[0]);
        } else {
          // ถ้าไม่มีวงเล็บ ให้แปลงเป็นตัวเลขโดยตรง
          score = Number(scoreStr);
        }

        // คำนวณเกรดใหม่
        const newGrade = calculateGrade(score, currentSubject.thresholds);
        
        return {
          'Student ID': student['Student ID'],
          'Name': student['Name'],
          'Score': `${score} (${newGrade})`
        };
      });

      // อัพเดทการแสดงผล
      setGradeData({
        summary: `${currentSubject.name} Grades:\n\n`,
        data: updatedGrades
      });

      // อัพเดทข้อมูลสำหรับบันทึก
      const savableGrades = updatedGrades.map(student => {
        const scoreStr = student['Score'].toString();
        const score = Number(scoreStr.split(' ')[0]);
        const grade = scoreStr.match(/\((.*?)\)/)?.[1] || '';

        return {
          academicYear: currentSubject.academicYear?.year || '',
          semester: currentSubject.academicYear?.semester || '',
          subject: currentSubject.name || '',
          studentId: student['Student ID']?.toString() || '',
          name: student['Name']?.toString() || '',
          score: score,
          grade: grade
        };
      });
      
      setGradesToSave(savableGrades);
    }
  }, [subjects, gradeData]); // เพิ่ม gradeData ใน dependencies

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    try {
      const data = await readExcelFile(file);
      
      // Format data without requiring subjects
      const formattedGrades = data.map(student => {
        const rawScore = Number(student['Score'].toString().split(' ')[0]) || 0;
        
        return {
          academicYear: subjects[0]?.academicYear?.year || '',
          semester: subjects[0]?.academicYear?.semester || '',
          subject: subjects[0]?.name || '',
          studentId: student['Student ID']?.toString() || '',
          name: student['Name']?.toString() || '',
          score: rawScore,
          grade: 'F' // เกรดเริ่มต้น
        };
      });

      setGradesToSave(formattedGrades);

      // Update display data
      const displayData = formattedGrades.map(grade => ({
        'Student ID': grade.studentId,
        'Name': grade.name,
        'Score': `${grade.score}`
      }));

      let summary = 'Grades:\n\n';
      formattedGrades.forEach(student => {
        summary += `\nStudent ID: ${student.studentId}\n`;
        summary += `Name: ${student.name}\n`;
        summary += `Score: ${student.score}\n`;
      });

      setGradeData({ summary, data: displayData });
    } catch (error) {
      console.error('Error details:', error);
      alert('Error processing file: ' + (error.message || 'Unknown error'));
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

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  // เพิ่มฟังก์ชันสำหรับการบันทึก
  const handleSave = async () => {
    try {
      setLoading(true);
      
      if (!subjects[0]?.name) {
        alert('Please set subject details before saving');
        return;
      }

      const currentSubject = subjects[0];
      
      // สร้างข้อมูลที่จะบันทึก
      const gradesToSave = gradeData.data.map(student => {
        const scoreStr = student['Score'].toString();
        let score: number;
        let grade: string;

        if (scoreStr.includes('(')) {
          // กรณีมีเกรดในวงเล็บ
          score = Number(scoreStr.split(' ')[0]);
          grade = scoreStr.match(/\((.*?)\)/)?.[1] || 'F';
        } else {
          // กรณีมีแค่คะแนน
          score = Number(scoreStr);
          grade = calculateGrade(score, currentSubject.thresholds);
        }

        return {
          academicYear: currentSubject.academicYear?.year || '',
          semester: currentSubject.academicYear?.semester || '',
          subject: currentSubject.name,
          studentId: student['Student ID'],
          name: student['Name'],
          score: score,
          grade: grade
        };
      });

      // บันทึกลง database
      await saveGrades(gradesToSave);
      alert('Grades saved successfully!');
    } catch (error) {
      console.error('Error saving grades:', error);
      alert('Error saving grades: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Drawer
        anchor="left"
        open={isSidebarOpen}
        onClose={toggleSidebar}
        variant="temporary"
      >
        <Box sx={{ width: 250, padding: 2 }}>
          <Button fullWidth onClick={toggleSidebar}>Close</Button>
          <Divider sx={{ my: 2 }} />
          <Button 
            fullWidth 
            onClick={() => {
              setCurrentView('grades');
              toggleSidebar();
            }}
          >
            Grade Report Summary
          </Button>
          <Button 
            fullWidth 
            onClick={() => {
              setCurrentView('chat');
              toggleSidebar();
            }}
          >
            AI Chatbot
          </Button>
        </Box>
      </Drawer>

      <Box sx={{ flexGrow: 1, padding: 3, position: 'relative' }}>
        <IconButton 
          edge="start" 
          color="inherit" 
          onClick={toggleSidebar} 
          sx={{ 
            position: 'fixed',
            top: 20, 
            left: 20,
            zIndex: 1000
          }}
        >
          <MenuIcon />
        </IconButton>

        <Container maxWidth="md" sx={{ marginTop: '40px' }}>
          {currentView === 'grades' ? (
            <Box sx={{ my: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom align="center">
                Grade Analysis System
              </Typography>

              <Settings subjects={subjects} onSubjectsChange={setSubjects} />
              
              <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <FileUpload onFileUpload={handleFileUpload} loading={loading} />
              </Paper>

              {/* เพิ่มปุ่ม Save */}
              {gradeData && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleSave}
                  sx={{ mt: 2, mb: 2 }}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save to Database'}
                </Button>
              )}

              {gradeData && (
                <Paper elevation={3} sx={{ p: 3 }}>
                  <GradeSummary 
                    data={gradeData}
                    subjects={subjects}
                  />
                </Paper>
              )}
            </Box>
          ) : (
            <Box sx={{ my: 4 }}>
              <Chatbot />
            </Box>
          )}
        </Container>
      </Box>
    </div>
  );
}

export default App;