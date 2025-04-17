import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Paper, CircularProgress, Divider, Grid,  Chip,  Table,  TableHead, TableRow,  TableCell,  TableBody,} from "@mui/material";
import { RazorpayButton } from "./Razorpay";

const Prescription = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const patientId = localStorage.getItem("id");

  useEffect(() => {
    if (patientId) {
      fetchPrescriptions();
    }
  }, [patientId]);

  const fetchPrescriptions = async () => {
    try {
      const res = await axios.get(`/eprescription/patient/${patientId}`);
      setPrescriptions(res.data.data || []);
    } catch (err) {
      console.error("Error fetching prescriptions:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1500, mx: "auto", mt: 5, p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Your Prescriptions
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : prescriptions.length === 0 ? (
        <Typography align="center" sx={{ mt: 4 }}>
          No prescriptions found.
        </Typography>
      ) : (
        prescriptions.map((presc) => (
          <Paper
            key={presc._id}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 3,
              boxShadow: 4,
              backgroundColor: "#fefefe",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Diagnosis:
                </Typography>
                <Typography>{presc.diagnosis || "N/A"}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Pulse Rate:
                </Typography>
                <Typography>{presc.pulseRate || "N/A"}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Symptoms:
                </Typography>
                <Typography>{presc.symptoms || "N/A"}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Next Visit:
                </Typography>
                <Typography>
                  {presc.nextvisit
                    ? new Date(presc.nextvisit).toLocaleDateString()
                    : "Not Scheduled"}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Medical History:
                </Typography>
                <Typography variant="body2">
                  {presc.medicalhistory || "N/A"}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Medications
            </Typography>

            {presc.medications?.length > 0 ? (
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell>Name</TableCell>
                    <TableCell>Dosage</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Instructions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {presc.medications.map((med, i) => (
                    <TableRow key={i}>
                      <TableCell>{med.name}</TableCell>
                      <TableCell>{med.dosage}</TableCell>
                      <TableCell>{med.quantity}</TableCell>
                      <TableCell>{med.instructions}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No medications listed.
              </Typography>
            )}

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body1">
                  <strong>Billing Amount:</strong> ₹{presc.billingAmount || 500}
                </Typography>
              </Grid>

              <Grid item xs={6} sx={{ textAlign: "right" }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Payment Status:</strong>{" "}
                  {presc.paymentStatus === "paid" ? (
                    <Chip label="Paid" color="success" size="small" />
                  ) : (
                    <Chip label="Not Paid" color="error" size="small" />
                  )}
                </Typography>

                {presc.paymentStatus !== "paid" && (
                  <RazorpayButton
                    prescriptionId={presc._id}
                    amount={presc.billingAmount || 500}
                    onSuccess={fetchPrescriptions}
                  />
                )}
              </Grid>
            </Grid>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default Prescription;