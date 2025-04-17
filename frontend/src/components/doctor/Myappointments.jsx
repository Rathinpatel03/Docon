import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

export const Myappointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("Pending"); // default filter
  const doctorEmail = localStorage.getItem("email");

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      const response = await axios.get(`/doctorprofile/myprofile/${doctorEmail}`);
      if (response.status === 200 && response.data.data) {
        fetchAppointments(response.data.data._id);
      }
    } catch (error) {
      console.error("Error fetching doctor profile:", error);
    }
  };

  const fetchAppointments = async (doctorId) => {
    try {
      const response = await axios.get(`appointment/doctor/appointments/${doctorId}`);
      if (response.status === 200 && response.data.data) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleStatusUpdate = async (_id, status) => {
    let cancelReason = "";
    if (status === "Declined") {
      cancelReason = prompt("Enter the reason for decline:");
      if (!cancelReason) return;
    }

    try {
      await axios.put(`/appointment/update/${_id}`, { status, cancelReason });
      toast.success(`Appointment ${status}`); // Success toast
      fetchDoctorProfile();
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Error updating appointment"); // Error toast
    }
  };

  const getFilteredAppointments = () => {
    switch (filter) {
      case "Pending":
        return appointments.filter(appt => appt.status === "pending");
      case "Approved":
        return appointments.filter(appt => appt.status === "Approved");
      case "Declined":
        return appointments.filter(appt => appt.status === "Declined");
      case "All":
      default:
        return appointments;
    }
  };

  return (
    <div className="container mt-4">
      <h2>My Appointments</h2>

      {/* Button Navbar Filter */}
      <div className="btn-group mb-4">
        <button
          className={`btn btn-outline-primary ${filter === "Pending" ? "active" : ""}`}
          onClick={() => setFilter("Pending")}
        >
          Pending
        </button>
        <button
          className={`btn btn-outline-success ${filter === "Approved" ? "active" : ""}`}
          onClick={() => setFilter("Approved")}
        >
          Approved
        </button>
        <button
          className={`btn btn-outline-danger ${filter === "Declined" ? "active" : ""}`}
          onClick={() => setFilter("Declined")}
        >
          Declined
        </button>
        <button
          className={`btn btn-outline-dark ${filter === "All" ? "active" : ""}`}
          onClick={() => setFilter("All")}
        >
          All
        </button>
      </div>

      {/* Appointment Table */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Age</th>
            <th>Appointment Date</th>
            <th>Appointment Time</th>
            <th>Appointment Type</th>
            {filter === "All" && <th>Status</th>}
            {filter === "Pending" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {getFilteredAppointments().map((appointment) => (
            <tr key={appointment._id}>
              <td>{appointment.patientName}</td>
              <td>{appointment.patientAge}</td>
              <td>{new Date(appointment.appointmentdate).toLocaleDateString()}</td>
              <td>{appointment.appointmenttime}</td>
              <td>{appointment.appointmentType}</td>
              {filter === "All" && <td>{appointment.status}</td>}
              {filter === "Pending" && (
                <td>
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => handleStatusUpdate(appointment._id, "Approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleStatusUpdate(appointment._id, "Declined")}
                  >
                    Decline
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {getFilteredAppointments().length === 0 && (
        <p className="text-muted">No {filter.toLowerCase()} appointments found.</p>
      )}

      {/* Add ToastContainer here */}
      <ToastContainer />
    </div>
  );
};

export default Myappointments;