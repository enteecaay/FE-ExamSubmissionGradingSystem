import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Rating,
  TextField,
  Alert,
  Skeleton,
} from '@mui/material';
import { Assessment as GradingIcon } from '@mui/icons-material';
import { submissionService } from '@/services/submissions';

const GradingPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [score, setScore] = useState(0);
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await submissionService.getSubmissions();
        if (!data || data.length === 0) {
          setError('No submissions found to grade');
        } else {
          setSubmissions(data);
          setSelectedSubmission(data[0]);
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

  const handleSubmitGrade = async () => {
    try {
      setSubmitting(true);
      if (selectedSubmission) {
        await submissionService.gradeSubmission(selectedSubmission.id, {
          totalScore: Math.min(score * 20, 100),
        });
        alert('Grade submitted successfully');
        setScore(0);
        setComments('');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to submit grade';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <GradingIcon /> Grading
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
        <GradingIcon /> Grading
      </Typography>

      {loading ? (
        <Paper sx={{ p: 3 }}>
          <Skeleton variant="rectangular" width="100%" height={400} />
        </Paper>
      ) : submissions.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            No submissions found to grade
          </Typography>
        </Paper>
      ) : (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Grade Submission
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Student: {selectedSubmission?.student || selectedSubmission?.studentName || selectedSubmission?.studentId || 'Unknown'} | Exam: {selectedSubmission?.exam || selectedSubmission?.examId || 'Unknown'}
          </Typography>

          <Card sx={{ mb: 3, backgroundColor: '#f8fafc' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Submission Preview
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Submission ID: {selectedSubmission?.id} | Status: {selectedSubmission?.status || 'Unknown'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                [Submission content would be displayed here]
              </Typography>
            </CardContent>
          </Card>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Rating (out of 5 stars = out of 100 points)
            </Typography>
            <Rating
              value={score}
              onChange={(_event, newValue) => {
                setScore(newValue || 0);
              }}
              size="large"
            />
            <Typography variant="body2" sx={{ color: '#64748b', mt: 1 }}>
              Score: {score * 20} / 100
            </Typography>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Comments"
            placeholder="Enter feedback for the student..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSubmitGrade} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Grade'}
            </Button>
            <Button variant="outlined" color="primary">
              Cancel
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default GradingPage;
