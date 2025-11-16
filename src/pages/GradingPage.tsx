import React from 'react';
import { Box, Typography, Paper, Card, CardContent, Button, Rating, TextField } from '@mui/material';
import { Assessment as GradingIcon } from '@mui/icons-material';

const GradingPage: React.FC = () => {
  const [score, setScore] = React.useState(0);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
        <GradingIcon /> Grading
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Grade Submission
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          Student: John Doe | Exam: Mathematics Final
        </Typography>

        <Card sx={{ mb: 3, backgroundColor: '#f8fafc' }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Submission Preview
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              [Submission content would be displayed here]
            </Typography>
          </CardContent>
        </Card>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Rating
          </Typography>
          <Rating
            value={score}
            onChange={(_event, newValue) => {
              setScore(newValue || 0);
            }}
            size="large"
          />
        </Box>

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Comments"
          placeholder="Enter feedback for the student..."
          sx={{ mb: 3 }}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" color="primary">
            Submit Grade
          </Button>
          <Button variant="outlined" color="primary">
            Cancel
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default GradingPage;
