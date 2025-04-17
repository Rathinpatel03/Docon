import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export const UpdateDoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    doctorname: "",
    specialization: "",
    experience: "",
    email: "",
    medicalRegistrationNumber: "",
    medicalCouncil: "",
    educationalCollege: "",
    dateofbirth: "",
  });

  const fetchDoctorProfile = async () => {
    try {
      const res = await axios.get(`/doctorprofile/doctor/${id}`);
      setFormData(res.data.data);
    } catch (err) {
      console.error("Failed to fetch doctor data", err);
    }
  };

  useEffect(() => {
    fetchDoctorProfile();
  
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      dateofbirth: doctor.dateofbirth ? doctor.dateofbirth.slice(0, 10) : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/doctorprofile/update/${id}`, formData);
      navigate("/admin/viewdoctorprofile");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 3, mt: 5 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Update Doctor Profile
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Doctor Name"
              name="doctorname"
              value={formData.doctorname}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Medical Registration Number"
              name="medicalRegistrationNumber"
              value={formData.medicalRegistrationNumber}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Medical Council"
              name="medicalCouncil"
              value={formData.medicalCouncil}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Educational College"
              name="educationalCollege"
              value={formData.educationalCollege}
              onChange={handleChange}
              fullWidth
              required
            />
       <TextField
label = "date of birth"
  type="date"
  name="dateofbirth"
  value={formData.dateofbirth ? formData.dateofbirth.slice(0, 10) : ""}
  onChange={(e) => setFormData({ ...formData, dateofbirth: e.target.value })}
/>

            <Button type="submit" variant="contained" color="primary">
              Update
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};