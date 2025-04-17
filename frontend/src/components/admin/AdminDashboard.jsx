import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, CircularProgress, Alert, Grid, Paper, List, ListItem, ListItemIcon,ListItemText } from "@mui/material";
import { Line, Doughnut } from "react-chartjs-2";
import {Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement,ArcElement,Tooltip,Legend,Title,} from "chart.js";
import { CalendarToday, People, CurrencyRupee,HourglassEmpty,Assignment,Person,FiberManualRecord} from "@mui/icons-material";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const StatCard = ({ icon: Icon, label, value, color }) => (
  <Paper
    elevation={3}
    sx={{p: 3,display: "flex",alignItems: "center",gap: 2, borderLeft: `6px solid ${color}`,backgroundColor: "#fff",  borderRadius: 2, }}
  >
    <Icon sx={{ fontSize: 40, color }} />
    <Box>
      <Typography variant="h6" fontWeight={500}>{label}</Typography>
      <Typography variant="h5" fontWeight="bold">{value}</Typography>
    </Box>
  </Paper>
);

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const roleId = "68006be8b6309ac6a6071303";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appointmentsResponse = await axios.get("/appointment/allAppointment");
        const doctorsResponse = await axios.get("/doctorprofile/allDoctor");
        const res = await axios.get(`/users/role/${roleId}`);
        const prescriptionsResponse = await axios.get("/eprescription/allPrescriptions");

        setAppointments(appointmentsResponse.data.data || []);
        setDoctors(doctorsResponse.data.data || []);
        setPatients(res.data.data || []);
        setPrescriptions(prescriptionsResponse.data.data || []);
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "90vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;
  }

  const pendingBills = prescriptions.filter(p => p.paymentStatus?.toLowerCase() !== "paid");

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const totalMonthlyBills = prescriptions
    .filter(p => {
      const date = new Date(p.createdAt);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  const statusCounts = {
    approved: appointments.filter(a => a.status === "Approved").length,
    declined: appointments.filter(a => a.status === "Declined").length,
    pending: appointments.filter(a => a.status === "pending").length,
  };

  const dailyAppointmentStats = appointments.reduce((acc, appt) => {
    const date = new Date(appt.appointmentdate).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const lineChartData = {
    labels: Object.keys(dailyAppointmentStats),
    datasets: [
      {
        label: "Appointments per Day",
        data: Object.values(dailyAppointmentStats),
        fill: false,
        backgroundColor: "#007bff",
        borderColor: "#007bff",
        tension: 0.3,
      },
    ],
  };

  const doughnutData = {
    labels: ["Approved", "Declined", "Pending"],
    datasets: [
      {
        data: [statusCounts.approved, statusCounts.declined, statusCounts.pending],
        backgroundColor: ["#28a745", "#dc3545", "#ffc107"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    height: 200,
  };

  const legendItems = [
    { color: "#28a745", label: "Approved" },
    { color: "#dc3545", label: "Declined" },
    { color: "#ffc107", label: "Pending" },
  ];

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", mt: 4, p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard icon={CalendarToday} label="Total Appointments" value={appointments.length} color="#2196f3" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard icon={Person} label="Total Doctors" value={doctors.length} color="#4caf50" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard icon={People} label="Total Patients" value={patients.length} color="#ff9800" />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              Daily Patient Appointments
            </Typography>
            <Line data={lineChartData} options={chartOptions} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              Appointment Status Overview
            </Typography>
            <Grid container>
              <Grid item xs={8}>
                <Doughnut data={doughnutData} options={chartOptions} />
              </Grid>
              <Grid item xs={4}>
                <List dense>
                  {legendItems.map((item, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <FiberManualRecord sx={{ color: item.color, fontSize: 14 }} />
                      </ListItemIcon>
                      <ListItemText primary={item.label} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;