import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';  // Import navigate

export const Appointment = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    getAllDoctor();
  }, []);

  const getAllDoctor = async () => {
    try {
      const res = await axios.get("/doctorprofile/allDoctor");
      setDoctors(res.data.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const { register, handleSubmit } = useForm();

  const submitHandler = async (data) => {
    const patientId = localStorage.getItem("id");
    data.patientId = patientId;
    const patientEmail = localStorage.getItem("email");
    data.patientEmail = patientEmail;
    console.log(data);

    try {
      const res = await axios.post("/appointment/addAppointment",data);
      console.log(res); //axios response
      // console.log(res.data); //api response

      // Redirect to view appointments
      navigate("/user/viewappointment");
    } catch (error) {
      console.error("Error submitting appointment:", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card p-4 shadow">
            <h2 className="text-center mb-4">Appointment</h2>
            <form onSubmit={handleSubmit(submitHandler)}>
              <div className="mb-3">
                <label className="form-label">Patient Name</label>
                <input type="text" className="form-control" {...register("patientName")} />
              </div>
              <div className="mb-3">
                <label className="form-label">Patient Age</label>
                <input type="number" className="form-control" {...register("patientAge")} /> {/* Removed extra space */}
              </div>
              <div className="mb-3">
                <label className="form-label">Select Doctor</label>
                <select className="form-select" {...register("doctorprofileId")}>
                  <option>Select doctor</option>
                  {doctors?.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.doctorname}({doctor.specialization})
                    </option>
                  ))}
                </select>
              </div>
         
              <div className="mb-3">
                <label className="form-label">Appointment Date</label>
                <input type="date" className="form-control" {...register("appointmentdate")} />
              </div>
              <div className="mb-3">
  <label className="form-label">Select Time Slot</label>
  <select className="form-select" {...register("appointmenttime")}>
    <option>Select Time</option>
    <option value="09:00 AM">09:00 AM</option>
    <option value="10:00 AM">10:00 AM</option>
    <option value="11:00 AM">11:00 AM</option>
    <option value="12:00 PM">12:00 PM</option>
    <option value="02:00 PM">02:00 PM</option>
    <option value="03:00 PM">03:00 PM</option>
    <option value="04:00 PM">04:00 PM</option>
    <option value="05:00 PM">05:00 PM</option>
    <option value="06:00 PM">06:00 PM</option>
    <option value="07:00 PM">07:00 PM</option>
  </select>
  
</div>
<div className="mb-3">
    <label className="form-label">Appointment Type</label>
    <select className="form-select" {...register("appointmentType")}>
      <option value="Offline">Offline</option>
      <option value="Online">Online</option>
    </select>
  </div>
                   <div className="mb-3">
                <label className="form-label">Reference</label>
                <input type="text" className="form-control" {...register("reference")} /> {/* Fixed field name */}
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};