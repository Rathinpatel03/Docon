import { Box, Typography, Chip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";

export const ViewAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const patientId = localStorage.getItem("id");

  useEffect(() => {
    if (patientId) {
      fetchAppointments();
    }
  }, [patientId]);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`/appointment/patient/${patientId}`);
      const updatedAppointments = await Promise.all(
        res.data.data.map(async (appointment) => {
          try {
            const doctorRes = await axios.get(`/doctorprofile/doctor/${appointment.doctorprofileId}`);
            const doctor = doctorRes.data.data;
            return {
              ...appointment,
              doctorName: doctor.doctorname,
              specialization: doctor.specialization,
            };
          } catch (err) {
            return { ...appointment, doctorName: "Unknown", specialization: "Unknown" };
          }
        })
      );
      setAppointments(updatedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]);
    }
  };

  const columns = [

    { field: "doctorName", headerName: "Doctor Name", width: 180 },
    { field: "specialization", headerName: "Specialization", width: 200 },
    { field: "appointmentdate", headerName: "Date", width: 150, renderCell: (params) => new Date(params.value).toLocaleDateString() },
    { field: "appointmenttime", headerName: "Time", width: 120 },
    { field: "appointmentType", headerName: "Apoointment Type", width: 200 },
    { 
      field: "status", 
      headerName: "Status", 
      width: 150,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={
            params.value === "Pending" ? "warning" : 
            params.value === "Approved" ? "success" : "error"
          } 
        />
      ),
    },
  ];

  return (
    <Box sx={{ mt: 5, mx: "auto", maxWidth: 1200 }}>
      <Typography variant="h4" align="center" gutterBottom>
        My Appointments
      </Typography>
      <Box sx={{ height: 500, width: "100%", bgcolor: "background.paper", boxShadow: 3, borderRadius: 2, p: 2 }}>
        <DataGrid
          rows={appointments}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          getRowId={(row) => row._id}
        />
      </Box>
    </Box>
  );
};