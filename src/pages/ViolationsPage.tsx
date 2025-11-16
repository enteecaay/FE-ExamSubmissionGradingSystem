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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Skeleton,
} from '@mui/material';
import { Warning as ViolationIcon } from '@mui/icons-material';
import { violationService } from '@/services/violations';

const ViolationsPage: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [violations, setViolations] = useState<any[]>([]);
  const [verifyNotes, setVerifyNotes] = useState('');

  useEffect(() => {
    const fetchViolations = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await violationService.getViolations();
        if (!data || data.length === 0) {
          setError('No violations found');
        } else {
          setViolations(data);
        }
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || err?.message || 'Failed to load violations';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchViolations();
  }, []);

  const handleVerify = (violation: any) => {
    setSelectedViolation(violation);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedViolation(null);
    setVerifyNotes('');
  };

  const handleSubmitVerification = async () => {
    try {
      if (selectedViolation) {
        await violationService.verifyViolation(selectedViolation.id, {
          verified: true,
        });
        setViolations(
          violations.map((v: any) =>
            v.id === selectedViolation.id ? { ...v, verified: true } : v
          )
        );
        handleCloseDialog();
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      alert(err?.response?.data?.message || 'Failed to verify violation');
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <ViolationIcon /> Violations
        </Typography>
        <Alert severity="error">
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Error Loading Violations
          </Typography>
          <Typography variant="body2">{error}</Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
        <ViolationIcon /> Violations
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Academic Violations</Typography>
        </Box>
      </Paper>

      {loading ? (
        <Box sx={{ py: 3 }}>
          <Skeleton variant="rectangular" width="100%" height={300} />
        </Box>
      ) : violations.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            No violations found
          </Typography>
        </Paper>
      ) : (
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
              {violations.map((violation: any) => (
                <TableRow key={violation.id} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                  <TableCell>{violation.student || violation.studentName || 'Unknown'}</TableCell>
                  <TableCell>{violation.exam || violation.examId || '-'}</TableCell>
                  <TableCell>{violation.type || violation.violationType || '-'}</TableCell>
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
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Verify Violation</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedViolation && (
            <Box>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Student:</strong> {selectedViolation.student || selectedViolation.studentName || 'Unknown'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Exam:</strong> {selectedViolation.exam || selectedViolation.examId || '-'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                <strong>Type:</strong> {selectedViolation.type || selectedViolation.violationType || '-'}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Verification Notes"
                placeholder="Enter your verification notes..."
                value={verifyNotes}
                onChange={(e) => setVerifyNotes(e.target.value)}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSubmitVerification}>
            Verify
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViolationsPage;
