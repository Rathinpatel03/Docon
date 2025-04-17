import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer,TableHead,  TableRow,Paper,} from '@mui/material';
import axios from 'axios';

const ViewPatient = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const roleId = "68006be8b6309ac6a6071303";

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get(`/users/role/${roleId}`);
        setPatients(res.data.data || []);
      } catch (err) {
        console.error("Error fetching patients:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) {
    return (
      <Container sx={{ mt: 5, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!patients.length) {
    return (
      <Container sx={{ mt: 5 }}>
        <Alert severity="info">No users with the selected role found.</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom align="center">
        Patient List
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>#</strong></TableCell>
              <TableCell><strong>First Name</strong></TableCell>
              <TableCell><strong>Last Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Age</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((user, index) => (
              <TableRow key={user._id || index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.firstName || 'N/A'}</TableCell>
                <TableCell>{user.lastName || 'N/A'}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.age || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ViewPatient;