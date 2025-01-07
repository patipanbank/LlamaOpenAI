import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper
} from '@mui/material';

interface Subject {
  name: string;
  thresholds: {
    A: number;
    'B+': number;
    B: number;
    'C+': number;
    C: number;
    'D+': number;
    D: number;
  };
  academicYear?: {
    year: string;
    semester: string;
  };
}

interface SettingsProps {
  subjects: Subject[];
  onSubjectsChange: (subjects: Subject[]) => void;
}

export function Settings({ subjects, onSubjectsChange }: SettingsProps) {
  const [subjectName, setSubjectName] = useState(subjects[0]?.name || '');
  const [academicYear, setAcademicYear] = useState(subjects[0]?.academicYear?.year || '');
  const [semester, setSemester] = useState(subjects[0]?.academicYear?.semester || '');
  const [thresholds, setThresholds] = useState(subjects[0]?.thresholds || {
    A: 80,
    'B+': 75,
    B: 70,
    'C+': 65,
    C: 60,
    'D+': 55,
    D: 50
  });

  const handleThresholdChange = (grade: string, value: string) => {
    setThresholds(prev => ({
      ...prev,
      [grade]: Number(value)
    }));
  };

  const handleSave = () => {
    const updatedSubject: Subject = {
      name: subjectName,
      thresholds,
      academicYear: {
        year: academicYear,
        semester
      }
    };
    onSubjectsChange([updatedSubject]);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Grade Threshold Settings
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Academic Year"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            placeholder="Enter 4-digit year"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            placeholder="Enter semester (1-3)"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Subject Name"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            margin="normal"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Grade Thresholds
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(thresholds).map(([grade, value]) => (
            <Grid item xs={6} sm={3} key={grade}>
              <TextField
                fullWidth
                label={`Grade ${grade}`}
                value={value}
                onChange={(e) => handleThresholdChange(grade, e.target.value)}
                type="number"
                margin="normal"
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
        >
          Update Subject
        </Button>
      </Box>
    </Paper>
  );
}

export type { Subject }; 