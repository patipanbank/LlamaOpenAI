
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography
} from '@mui/material';
import { Subject } from './Settings';

interface GradeSummaryProps {
  data: {
    summary: string;
    data: Array<{
      'Student ID': string;
      'Name': string;
      'Score': string;
    }>;
  };
  subjects: Subject[];
}

function GradeSummary({ data, subjects }: GradeSummaryProps) {
  const currentSubject = subjects[0];
  
  return (
    <>
      <Typography variant="h6" gutterBottom>
        {currentSubject ? `${currentSubject.name} Grades` : 'Grades'}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data.map((student, index) => (
              <TableRow key={`${student['Student ID']}-${index}`}>
                <TableCell>{student['Student ID']}</TableCell>
                <TableCell>{student['Name']}</TableCell>
                <TableCell>{student['Score']}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default GradeSummary; 