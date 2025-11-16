import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip } from '@mui/material';
import { Assignment as ExamIcon } from '@mui/icons-material';

const ExamsPage: React.FC = () => {
  const mockExams = [
    { id: 1, title: 'Mathematics Final', semester: 'Fall 2024', status: 'Active', date: '2024-11-20' },
    { id: 2, title: 'Physics Midterm', semester: 'Fall 2024', status: 'Closed', date: '2024-10-15' },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
        <ExamIcon /> Exams
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">All Exams</Typography>
          <Button variant="contained" color="primary">
            Create Exam
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
              <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Semester</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockExams.map((exam) => (
              <TableRow key={exam.id} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                <TableCell>{exam.title}</TableCell>
                <TableCell>{exam.semester}</TableCell>
                <TableCell>{exam.date}</TableCell>
                <TableCell>
                  <Chip
                    label={exam.status}
                    color={exam.status === 'Active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button size="small" variant="outlined">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ExamsPage;
