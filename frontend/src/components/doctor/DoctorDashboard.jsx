import React, { useEffect, useState } from "react";
import axios from "axios";
import {Box,Typography,CircularProgress, Alert, Grid, Paper, useTheme,} from "@mui/material";
import {
  CalendarToday,
  VideoCall,
  HourglassEmpty,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";

const StatCard = ({ icon: Icon, label, value, color }) => {
  return (
    <Paper
      elevation={3}
      sx={{ p: 3, display: "flex",  alignItems: "center",  gap: 2, borderLeft: `6px solid ${color}`,  backgroundColor: "#fff",  borderRadius: 2, }}
    >
      <Icon sx={{ fontSize: 40, color }} />
      <Box>
        <Typography variant="h6" fontWeight={500}>
          {label}
        </Typography>
        <Typography variant="h5" fontWeight="bold">
          {value}
        </Typography>
      </Box>
    </Paper>
  );
};

const DoctorDashboard = () => {
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [onlineAppointments, setOnlineAppointments] = useState(0);
  const [pendingAppointments, setPendingAppointments] = useState(0);
  const [approvedAppointments, setApprovedAppointments] = useState(0);
  const [declinedAppointments, setDeclinedAppointments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const doctorEmail = localStorage.getItem("email");

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      const response = await axios.get(`/doctorprofile/myprofile/${doctorEmail}`);
      if (response.status === 200 && response.data.data) {
        const profile = response.data.data;
        setDoctorProfile(profile);
        fetchAppointments(profile._id);
      }
    } catch (err) {
      setError("Failed to fetch doctor profile.");
      setLoading(false);
    }
  };

  const fetchAppointments = async (doctorId) => {
    try {
      const response = await axios.get(`/appointment/doctor/appointments/${doctorId}`);
      if (response.status === 200 && response.data.data) {
        const allAppointments = response.data.data;
        setTotalAppointments(allAppointments.length);
        setOnlineAppointments(allAppointments.filter(appt => appt.appointmentType === "Online").length);
        setPendingAppointments(allAppointments.filter(appt => appt.status === "pending").length);
        setApprovedAppointments(allAppointments.filter(appt => appt.status === "Approved").length);
        setDeclinedAppointments(allAppointments.filter(appt => appt.status === "Declined").length);
      }
    } catch (err) {
      setError("Failed to fetch appointments.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "97vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", mt: 4, p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Doctor Dashboard
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard icon={CalendarToday} label="Total Appointments" value={totalAppointments} color="#2196f3" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard icon={VideoCall} label="Online Appointments" value={onlineAppointments} color="#3f51b5" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard icon={HourglassEmpty} label="Pending Appointments" value={pendingAppointments} color="#ffc107" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard icon={CheckCircle} label="Approved Appointments" value={approvedAppointments} color="#4caf50" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard icon={Cancel} label="Declined Appointments" value={declinedAppointments} color="#f44336" />
        </Grid>
      </Grid>

      {doctorProfile && (
        <Box sx={{ mt: 5, p: 3, backgroundColor: "#f4f6f8", borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>Doctor Profile</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Name:</strong> {doctorProfile.doctorname}</Typography>
              <Typography><strong>Email:</strong> {doctorProfile.email}</Typography>
              <Typography><strong>Specialization:</strong> {doctorProfile.specialization}</Typography>
              <Typography><strong>Experience:</strong> {doctorProfile.experience} years</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Medical Council:</strong> {doctorProfile.medicalCouncil}</Typography>
              <Typography><strong>Educational College:</strong> {doctorProfile.educationalCollege}</Typography>
              <Typography><strong>Date of Birth:</strong> {doctorProfile.dateofbirth ? new Date(doctorProfile.dateofbirth).toLocaleDateString() : "Not recorded"}</Typography>
              <Typography><strong>Medical Registration Number:</strong> {doctorProfile.medicalRegistrationNumber}</Typography>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default DoctorDashboard;