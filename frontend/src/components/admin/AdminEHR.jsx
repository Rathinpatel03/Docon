import React, { useEffect, useState } from "react";
import axios from "axios";
import {Box,Typography,Paper,Table,TableHead, TableRow,TableCell, TableBody,CircularProgress,Grid, Divider,TextField,} from "@mui/material";

const AdminEHR = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAllPrescriptions();
  }, []);

  const fetchAllPrescriptions = async () => {
    try {
      const response = await axios.get("/eprescription/allprescriptions");
      if (response.status === 200) {
        setPrescriptions(response.data);
      }
    } catch (error) {
      console.error("Error fetching all prescriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrescriptions = prescriptions.filter((record) =>
    record.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.doctorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", mt: 4, p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
         Electronic Health Records - All Patients
      </Typography>

      <Box sx={{ mt: 3, mb: 4, maxWidth: 1400, mx: "auto" }}>
        <TextField
          fullWidth
          label="Search by Patient or Doctor Name"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : filteredPrescriptions.length === 0 ? (
        <Typography variant="body1" align="center" sx={{ mt: 5 }}>
          No prescriptions found.
        </Typography>
      ) : (
        filteredPrescriptions.map((record) => (
          <Paper key={record._id} sx={{ mb: 4, p: 3, borderRadius: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography><strong>Patient:</strong> {record.patientName}</Typography>
                <Typography><strong>Email:</strong> {record.patientEmail || "N/A"}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography><strong>Doctor:</strong> {record.doctorName || "Unknown"}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography><strong>Date Issued:</strong> {new Date(record.dateIssued).toLocaleDateString()}</Typography>
                <Typography><strong>Next Visit:</strong> {record.nextvisit ? new Date(record.nextvisit).toLocaleDateString() : "Not Scheduled"}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography><strong>Diagnosis:</strong> {record.diagnosis || "N/A"}</Typography>
                <Typography><strong>Symptoms:</strong> {record.symptoms || "N/A"}</Typography>
                <Typography><strong>Pulse Rate:</strong> {record.pulseRate || "N/A"}</Typography>
              </Grid>
            </Grid>

            {record.medicalhistory && (
              <Box sx={{ mt: 2 }}>
                <Typography><strong>Medical History Notes:</strong></Typography>
                <Typography variant="body2">{record.medicalhistory}</Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6">Medications</Typography>
            {record.medications?.length > 0 ? (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Dosage</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Instructions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {record.medications.map((med, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{med.name}</TableCell>
                      <TableCell>{med.dosage}</TableCell>
                      <TableCell>{med.quantity}</TableCell>
                      <TableCell>{med.instructions}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography variant="body2" color="text.secondary">No medications listed.</Typography>
            )}
          </Paper>
        ))
      )}
    </Box>
  );
};

export default AdminEHR;