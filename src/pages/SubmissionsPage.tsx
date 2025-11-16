import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { FilePresent as SubmissionIcon } from '@mui/icons-material';

const SubmissionsPage: React.FC = () => {
  const mockSubmissions = [
    { id: 1, student: 'John Doe', exam: 'Mathematics Final', submittedAt: '2024-11-20', status: 'Graded', score: '95' },
    { id: 2, student: 'Jane Smith', exam: 'Mathematics Final', submittedAt: '2024-11-20', status: 'Pending', score: '-' },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
        <SubmissionIcon /> Submissions
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Student Submissions</Typography>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
              <TableCell sx={{ fontWeight: 700 }}>Student Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Exam</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Submitted</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Score</TableCell>
              {/* <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {mockSubmissions.map((submission) => (
              <TableRow key={submission.id} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                <TableCell>{submission.student}</TableCell>
                <TableCell>{submission.exam}</TableCell>
                <TableCell>{submission.submittedAt}</TableCell>
                <TableCell>
                  <Chip
                    label={submission.status}
                    color={submission.status === 'Graded' ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{submission.score}</TableCell>
                {/* <TableCell>
                  <Button size="small" variant="outlined">
                    Review
                  </Button>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SubmissionsPage;
