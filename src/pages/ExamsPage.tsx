import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Alert,
  Skeleton,
} from '@mui/material';
import { Assignment as ExamIcon } from '@mui/icons-material';
import { courseService } from '@/services/courses';

const ExamsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exams, setExams] = useState<any[]>([]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await courseService.getExams();
        if (!data || data.length === 0) {
          setError('No exams found');
        } else {
          setExams(data);
        }
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || err?.message || 'Failed to load exams';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('active')) return 'success';
    if (statusLower.includes('closed')) return 'default';
    return 'default';
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <ExamIcon /> Exams
        </Typography>
        <Alert severity="error">
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Error Loading Exams
          </Typography>
          <Typography variant="body2">{error}</Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
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

      {loading ? (
        <Box sx={{ py: 3 }}>
          <Skeleton variant="rectangular" width="100%" height={300} />
        </Box>
      ) : exams.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            No exams found
          </Typography>
        </Paper>
      ) : (
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
              {exams.map((exam: any) => (
                <TableRow key={exam.id} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                  <TableCell>{exam.title || exam.name || 'Untitled Exam'}</TableCell>
                  <TableCell>{exam.semester || exam.semesterId || '-'}</TableCell>
                  <TableCell>{exam.date || exam.startTime || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={exam.status || 'Active'}
                      color={getStatusColor(exam.status) as any}
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
      )}
    </Box>
  );
};

export default ExamsPage;
