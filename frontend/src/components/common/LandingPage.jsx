import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  LocalHospital,
  Schedule,
  People,
  VideoCall,
  Receipt,
  NotificationsActive,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: <LocalHospital fontSize="inherit" />,
    title: "Electronic Health Records",
    desc: "Secure storage and sharing of patient data.",
  },
  {
    icon: <Schedule fontSize="inherit" />,
    title: "Appointment Scheduling",
    desc: "Efficient queue and time slot management.",
  },
  {
    icon: <VideoCall fontSize="inherit" />,
    title: "Telemedicine",
    desc: "Remote consultations via  chat.",
  },
  {
    icon: <Receipt fontSize="inherit" />,
    title: "Automated Billing",
    desc: "seamless payments.",
  },
  {
    icon: <NotificationsActive fontSize="inherit" />,
    title: "Health Reminders",
    desc: "Automated alerts for medications.",
  }, 
  {
    icon: <People fontSize="inherit" />,
    title: "Doctor-Patient Portal",
    desc: "seamless communication between patients and doctors.",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: "#fafafa", color: "#000", width: "100vw", overflowX: "hidden" }}>
      {/* Navbar */}
      <AppBar position="fixed" elevation={2} sx={{ background: "#111", px: 2 }}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              cursor: "pointer",
              letterSpacing: 1,
              color: "#fff",
            }}
            onClick={() => navigate("/")}
          >
            Docon - Digital Healthcare
          </Typography>
          <Button onClick={() => navigate("/login")} color="inherit" sx={{ fontWeight: 600 }}>
            Login
          </Button>
          <Button
            onClick={() => navigate("/signup")}
            variant="contained"
            color="secondary"
            sx={{
              ml: 2,
              fontWeight: "bold",
              borderRadius: "30px",
              px: 3,
              py: 1,
              textTransform: "none",
            }}
          >
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(to bottom, #f5f5f5 0%, #fff 100%)",
          color: "#000",
          pt: 20,
          pb: 12,
          textAlign: "center",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            fontWeight="bold"
            gutterBottom
            sx={{ fontSize: { xs: "2rem", md: "3.2rem" } }}
          >
            Transforming Healthcare with Docon
          </Typography>
          <Typography
            variant="h6"
            sx={{ opacity: 0.8, fontSize: "1.2rem", color: "#444", mt: 2 }}
          >
            A smart healthcare solution integrating appointment scheduling, digital health records, telemedicine, and billing to enhance accessibility and efficiency.
          </Typography>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 10 }}>
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight="bold"
          mb={5}
          sx={{ fontSize: { xs: "1.8rem", md: "2.5rem" } }}
        >
          Key Features of Docon
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, i) => (
            <Grid item xs={12} sm={4} md={3} key={i}>
              <Card
                sx={{
                  textAlign: "center",
                  p: 3,
                  background: "#fff",
                  color: "#000",
                  borderRadius: "20px",
                  border: "1px solid #eee",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ fontSize: 48, color: "#7b1fa2" }}>{feature.icon}</Box>
                  <Typography variant="h6" fontWeight="bold" mt={2}>
                    {feature.title}
                  </Typography>
                  <Typography sx={{ color: "#666", mt: 1, fontSize: "0.95rem" }}>
                    {feature.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Contact Section */}
      <Box sx={{ backgroundColor: "#f9f9f9", py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography variant="h4" fontWeight="bold" mb={3}>
            Contact Us
          </Typography>
          <Typography variant="h6" sx={{ color: "#555", mb: 1 }}>
            Address: 123 HealthCare St, Ahmedabad, Gujarat, India
          </Typography>
          <Typography variant="h6" sx={{ color: "#555", mb: 1 }}>
            Email: support@docon.com
          </Typography>
          <Typography variant="h6" sx={{ color: "#555" }}>
            Phone: +91 98678 86787
          </Typography>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: "#000", color: "#ccc", textAlign: "center", py: 3 }}>
        <Typography variant="body2">
          ©️ 2025 Docon. All Rights Reserved.
        </Typography>
      </Box>
    </div>
  );
};

export default LandingPage;
