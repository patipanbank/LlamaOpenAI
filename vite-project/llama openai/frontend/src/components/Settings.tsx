import React from 'react';
import {
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export interface GradeThreshold {
  A: number;
  'B+': number;
  B: number;
  'C+': number;
  C: number;
  'D+': number;
  D: number;
}

export interface Subject {
  id: string;
  name: string;
  thresholds: GradeThreshold;
}

interface SettingsProps {
  subjects: Subject[];
  onSubjectsChange: (subjects: Subject[]) => void;
}

const defaultThresholds: GradeThreshold = {
  A: 80,
  'B+': 75,
  B: 70,
  'C+': 65,
  C: 60,
  'D+': 55,
  D: 50,
};

export const Settings: React.FC<SettingsProps> = ({ subjects, onSubjectsChange }) => {
  const addSubject = () => {
    onSubjectsChange([
      ...subjects,
      {
        id: Date.now().toString(),
        name: '',
        thresholds: { ...defaultThresholds },
      },
    ]);
  };

  const removeSubject = (id: string) => {
    onSubjectsChange(subjects.filter((subject) => subject.id !== id));
  };

  const updateSubject = (id: string, field: string, value: string | number) => {
    onSubjectsChange(
      subjects.map((subject) =>
        subject.id === id
          ? {
              ...subject,
              [field]: value,
            }
          : subject
      )
    );
  };

  const updateThreshold = (subjectId: string, grade: keyof GradeThreshold, value: number) => {
    onSubjectsChange(
      subjects.map((subject) =>
        subject.id === subjectId
          ? {
              ...subject,
              thresholds: {
                ...subject.thresholds,
                [grade]: value,
              },
            }
          : subject
      )
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Subjects and Grade Thresholds
      </Typography>
      
      {subjects.map((subject) => (
        <Grid container key={subject.id} spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Subject Name"
              value={subject.name}
              onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Grid container spacing={1}>
              {Object.entries(subject.thresholds).map(([grade, threshold]) => (
                <Grid item xs={6} sm={3} key={grade}>
                  <TextField
                    fullWidth
                    size="small"
                    label={`Grade ${grade}`}
                    type="number"
                    value={threshold}
                    onChange={(e) =>
                      updateThreshold(subject.id, grade as keyof GradeThreshold, Number(e.target.value))
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12} md={1}>
            <IconButton onClick={() => removeSubject(subject.id)} color="error">
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      
      <Button variant="contained" onClick={addSubject}>
        Add Subject
      </Button>
    </Paper>
  );
}; 