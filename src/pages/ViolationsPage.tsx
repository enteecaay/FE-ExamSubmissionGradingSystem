import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Warning as ViolationIcon } from '@mui/icons-material';

const ViolationsPage: React.FC = () => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedViolation, setSelectedViolation] = React.useState<any>(null);

  const mockViolations = [
    { id: 1, student: 'John Doe', exam: 'Mathematics Final', type: 'Plagiarism', verified: false },
    { id: 2, student: 'Jane Smith', exam: 'Physics Midterm', type: 'Cheating', verified: true },
  ];

  const handleVerify = (violation: any) => {
    setSelectedViolation(violation);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedViolation(null);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
        <ViolationIcon /> Violations
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Academic Violations</Typography>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
              <TableCell sx={{ fontWeight: 700 }}>Student</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Exam</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Verified</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockViolations.map((violation) => (
              <TableRow key={violation.id} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                <TableCell>{violation.student}</TableCell>
                <TableCell>{violation.exam}</TableCell>
                <TableCell>{violation.type}</TableCell>
                <TableCell>
                  <Chip
                    label={violation.verified ? 'Verified' : 'Pending'}
                    color={violation.verified ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleVerify(violation)}
                    disabled={violation.verified}
                  >
                    {violation.verified ? 'Verified' : 'Verify'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Verify Violation</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedViolation && (
            <Box>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Student:</strong> {selectedViolation.student}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Exam:</strong> {selectedViolation.exam}
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                <strong>Type:</strong> {selectedViolation.type}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Verification Notes"
                placeholder="Enter your verification notes..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleCloseDialog}>
            Verify
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViolationsPage;
