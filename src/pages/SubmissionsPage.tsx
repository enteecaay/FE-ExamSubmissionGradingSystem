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
  Chip,
  Alert,
  Skeleton,
} from '@mui/material';
import { FilePresent as SubmissionIcon } from '@mui/icons-material';
import { submissionService } from '@/services/submissions';

const SubmissionsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await submissionService.getSubmissions();
        if (!data || data.length === 0) {
          setError('No submissions found');
        } else {
          setSubmissions(data);
        }
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || err?.message || 'Failed to load submissions';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('graded') || statusLower.includes('completed')) return 'success';
    if (statusLower.includes('pending')) return 'warning';
    return 'info';
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <SubmissionIcon /> Submissions
        </Typography>
        <Alert severity="error">
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Error Loading Submissions
          </Typography>
          <Typography variant="body2">{error}</Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
        <SubmissionIcon /> Submissions
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Student Submissions</Typography>
        </Box>
      </Paper>

      {loading ? (
        <Box sx={{ py: 3 }}>
          <Skeleton variant="rectangular" width="100%" height={300} />
        </Box>
      ) : submissions.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            No submissions found
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
                <TableCell sx={{ fontWeight: 700 }}>Student Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Exam</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Submitted</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((submission: any) => (
                <TableRow key={submission.id} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                  <TableCell>{submission.student || submission.studentName || submission.studentId || 'Unknown'}</TableCell>
                  <TableCell>{submission.exam || submission.examId || '-'}</TableCell>
                  <TableCell>{submission.submittedAt || submission.submitDate || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={submission.status || 'Unknown'}
                      color={getStatusColor(submission.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{submission.score !== null && submission.score !== undefined ? submission.score : '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default SubmissionsPage;
