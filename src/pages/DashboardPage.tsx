import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Box,
  Stack,
  Typography,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { courseService } from '@/services/courses';
import { submissionService } from '@/services/submissions';

interface Submission {
  id: string | number;
  examId?: string | number;
  studentId?: string | number;
  studentName?: string;
  exam?: string;
  student?: string;
  submitDate?: string;
  submittedAt?: string;
  status?: string;
  score?: number | null;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const examsData = await courseService.getExams();

        const submissionsData = await submissionService.getSubmissions();
        setSubmissions(submissionsData || []);

        const totalExams = examsData?.length || 0;
        const pendingSubmissions =
          submissionsData?.filter(
            (s: any) => s.status?.toLowerCase() === 'submitted' || s.status?.toLowerCase() === 'pending'
          ).length || 0;
        const completedGrading =
          submissionsData?.filter(
            (s: any) => s.status?.toLowerCase() === 'graded' || s.status?.toLowerCase() === 'completed'
          ).length || 0;
        const upcomingExams =
          examsData?.filter((e: any) => {
            const examDate = new Date(e.startTime || e.date);
            return examDate > new Date();
          }).length || 0;

        setStats([
          {
            title: 'Total Exams',
            value: totalExams.toString(),
            icon: SchoolIcon,
            color: '#22c55e',
          },
          {
            title: 'Pending Submissions',
            value: pendingSubmissions.toString(),
            icon: AssignmentIcon,
            color: '#0ea5e9',
          },
          {
            title: 'Completed Grading',
            value: completedGrading.toString(),
            icon: CheckCircleIcon,
            color: '#22c55e',
          },
          {
            title: 'Upcoming Exams',
            value: upcomingExams.toString(),
            icon: ScheduleIcon,
            color: '#f59e0b',
          },
        ]);
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || err?.message || 'Failed to load dashboard data';
        setError(errorMessage);
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusChipColor = (status?: string) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('submitted') || statusLower.includes('pending')) return 'info';
    if (statusLower.includes('graded') || statusLower.includes('completed')) return 'success';
    if (statusLower.includes('review')) return 'warning';
    return 'default';
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Error Loading Dashboard
          </Typography>
          <Typography variant="body2">{error}</Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Welcome Back!
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          Here's what's happening with your exams and submissions today.
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {loading
          ? Array(4)
            .fill(0)
            .map((_, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card>
                  <CardContent>
                    <Skeleton variant="rectangular" width="100%" height={60} />
                  </CardContent>
                </Card>
              </Grid>
            ))
          : stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: '8px',
                          backgroundColor: `${stat.color}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <IconComponent sx={{ color: stat.color, fontSize: 28 }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                          {stat.title}
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                          {stat.value}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
      </Grid>

      {/* Quick Actions and Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Quick Actions" titleTypographyProps={{ variant: 'h6' }} />
            <CardContent>
              <Stack spacing={2}>
                <Button color="primary" fullWidth onClick={() => navigate('/exams')} variant="contained">
                  View Exams
                </Button>
                <Button color="primary" fullWidth onClick={() => navigate('/submissions')} variant="outlined">
                  Review Submissions
                </Button>
                <Button color="primary" fullWidth onClick={() => navigate('/grading')} variant="outlined">
                  Grade Papers
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title="Recent Submissions" titleTypographyProps={{ variant: 'h6' }} />
            <CardContent>
              {loading ? (
                <Box sx={{ py: 3 }}>
                  <Skeleton variant="rectangular" width="100%" height={200} />
                </Box>
              ) : submissions.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#64748b', py: 3, textAlign: 'center' }}>
                  No submissions found
                </Typography>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
                        <TableCell>Exam</TableCell>
                        <TableCell>Student</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Score</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {submissions.slice(0, 5).map(submission => (
                        <TableRow key={submission.id} hover>
                          <TableCell>{submission.exam || submission.examId || '-'}</TableCell>
                          <TableCell>{submission.student || submission.studentName || '-'}</TableCell>
                          <TableCell>
                            <Chip
                              label={submission.status || 'Unknown'}
                              size="small"
                              color={getStatusChipColor(submission.status || '') as any}
                            />
                          </TableCell>
                          <TableCell align="right">
                            {submission.score !== null && submission.score !== undefined ? (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {submission.score}%
                                <LinearProgress
                                  variant="determinate"
                                  value={Math.min(submission.score, 100)}
                                  sx={{ width: 60 }}
                                />
                              </Box>
                            ) : (
                              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                                -
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
