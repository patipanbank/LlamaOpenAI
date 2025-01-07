import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Select, MenuItem, FormControl, InputLabel, TextField, Grid } from '@mui/material';
import { Subject } from './Settings';

interface GradeSummaryProps {
  data: {
    summary: string;
    data: Record<string, string | number>[];
  };
  subjects: Subject[];
}

const GradeSummary: React.FC<GradeSummaryProps> = ({ data, subjects }) => {
  const [selectedSubject, setSelectedSubject] = React.useState<string>(subjects[0]?.name || '');

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
    <>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Select Subject</InputLabel>
            <Select
              value={selectedSubject}
              label="Select Subject"
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {subjects.map(subject => (
                <MenuItem key={subject.id} value={subject.name}>
                  {subject.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>Grade Thresholds</Typography>
          <Grid container spacing={2}>
            {subjects.find(s => s.name === selectedSubject)?.thresholds && 
              Object.entries(subjects.find(s => s.name === selectedSubject)!.thresholds).map(([grade, threshold]) => (
                <Grid item xs={6} sm={3} key={grade}>
                  <TextField
                    label={`Grade ${grade}`}
                    value={threshold}
                    disabled
                    fullWidth
                    size="small"
                  />
                </Grid>
              ))
            }
          </Grid>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Typography variant="h6" component="div" sx={{ p: 2 }}>
          {selectedSubject} Grades
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data.map((student, index) => {
              const score = Number(student['Score']);
              const subject = subjects.find(s => s.name === selectedSubject);
              const letterGrade = subject ? getLetterGrade(score, subject.thresholds) : '';
              return (
                <TableRow key={index}>
                  <TableCell>{student['Student ID']}</TableCell>
                  <TableCell>{student['Name']}</TableCell>
                  <TableCell>
                    {score} ({letterGrade})
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default GradeSummary; 