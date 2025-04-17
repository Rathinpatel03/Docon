import { Box, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom"; // if using react-router

export const ViewDoctorProfile = () => {
  const [screens, setScreens] = useState([]);
  const navigate = useNavigate();

  const columns = [
    { field: "_id", headerName: "ID", width: 210 },
    { field: "doctorname", headerName: "Doctor Name", width: 120 },
    { field: "specialization", headerName: "Specialization", width: 140 },
    { field: "experience", headerName: "Experience", width: 70 },
    { field: "email", headerName: "Email", width: 170 },
    {
      field: "medicalRegistrationNumber",
      headerName: "Medical Registration Number",
      width: 150,
    },
    { field: "medicalCouncil", headerName: "Medical Council", width: 150 },
    { field: "educationalCollege", headerName: "Educational College", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            onClick={() => handleEdit(params.row._id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row._id)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const getAllMyScreens = async () => {
    const res = await axios.get("/doctorprofile/allDoctor");
    setScreens(res.data.data);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/doctorprofile/delete/${id}`);
      getAllMyScreens(); // Refresh after delete
    } catch (err) {
      console.error("Error deleting doctor profile:", err);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/update-doctor/${id}`); // route to edit form
  };

  useEffect(() => {
    getAllMyScreens();
  }, []);

  return (
    <div align="center">
      <h4>View Doctor Profiles</h4>
      <Box sx={{ height: 600, width: "95%" }}>
        <DataGrid
          rows={screens}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          getRowId={(row) => row._id}
        />
      </Box>
    </div>
  );
};