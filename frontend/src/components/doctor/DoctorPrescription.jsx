import React, { useEffect, useState } from "react";
import axios from "axios";

const DoctorPrescription = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointmentsByDate, setFilteredAppointmentsByDate] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedPatientName, setSelectedPatientName] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [patientPrescriptions, setPatientPrescriptions] = useState([]);

  const [prescriptionData, setPrescriptionData] = useState({
    symptoms: "",
    diagnosis: "",
    pulseRate: "",
    medications: [{ name: "", dosage: "", quantity: "", instructions: "" }],
    nextvisit: "",
    medicalhistory: "",
  });

  const doctorEmail = localStorage.getItem("email");

  useEffect(() => {
    if (doctorEmail) fetchDoctorProfile();
  }, [doctorEmail]);

  const fetchDoctorProfile = async () => {
    try {
      const response = await axios.get(`/doctorprofile/myprofile/${doctorEmail}`);
      if (response.status === 200 && response.data.data) {
        const doctorData = response.data.data;
        setDoctorId(doctorData._id || "Unknown ID");
        fetchAppointments(doctorData._id);
      }
    } catch (error) {
      console.error("Error fetching doctor profile:", error);
    }
  };

  const fetchAppointments = async (doctorId) => {
    try {
      const response = await axios.get(`/appointment/doctor/appointments/${doctorId}`);
      if (response.status === 200 && response.data.data) {
        const sortedAppointments = response.data.data
          .filter((appt) => appt.status === "Approved")
          .sort((a, b) => new Date(b.appointmentdate) - new Date(a.appointmentdate));
        setAppointments(sortedAppointments);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const fetchPatientHistory = async (patientId) => {
    try {
      const response = await axios.get(`/eprescription/patient/${patientId}`);
      if (response.status === 200) {
        setPatientPrescriptions(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching patient history:", err);
    }
  };

  const handleAddMedication = () => {
    setPrescriptionData((prev) => ({
      ...prev,
      medications: [...prev.medications, { name: "", dosage: "", quantity: "", instructions: "" }],
    }));
  };

  const handleMedicationChange = (index, field, value) => {
    setPrescriptionData((prev) => {
      const updated = prev.medications.map((med, i) =>
        i === index ? { ...med, [field]: value } : med
      );
      return { ...prev, medications: updated };
    });
  };

  const submitPrescription = async () => {
    if (!selectedAppointment || !doctorId) {
      alert("Please select an appointment and ensure doctor details are loaded.");
      return;
    }

    const payload = {
      patientName: selectedAppointment.patientName,
      patientId: selectedAppointment.patientId,
      doctorId,
      symptoms: prescriptionData.symptoms,
      diagnosis: prescriptionData.diagnosis,
      pulseRate: prescriptionData.pulseRate,
      medications: prescriptionData.medications,
      nextvisit: prescriptionData.nextvisit,
      medicalhistory: prescriptionData.medicalhistory,
      billingAmount: prescriptionData.billingAmount,
    };

    try {
      await axios.post("/eprescription/prescriptions", payload);
      await axios.patch(`/appointment/update-status/${selectedAppointment._id}`, {
        status: "complete",
      });

      alert("E-Prescription submitted and appointment marked as completed!");
      fetchAppointments(doctorId);
      setSelectedAppointment(null);
      setSelectedPatientName("");
      setSelectedDate("");
      setPrescriptionData({
        symptoms: "",
        diagnosis: "",
        pulseRate: "",
        medications: [{ name: "", dosage: "", quantity: "", instructions: "" }],
        nextvisit: "",
        medicalhistory: "",
      });
      setPatientPrescriptions([]);
    } catch (error) {
      console.error("Error submitting prescription:", error);
      alert("Error submitting prescription.");
    }
  };

  return (
    <div style={{ maxWidth: "1500px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>E-Prescription Portal</h2>

      <div style={{ padding: "20px", marginTop: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <h3>Select Appointment</h3>
        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ flex: "1" }}>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                const date = e.target.value;
                setSelectedDate(date);
                const filtered = appointments.filter((appt) => {
                  const apptDate = new Date(appt.appointmentdate).toISOString().split("T")[0];
                  return apptDate === date;
                });
                setFilteredAppointmentsByDate(filtered);
                setSelectedPatientName("");
                setSelectedAppointment(null);
              }}
              style={{ width: "100%" }}
            />
          </div>

          {selectedDate && (
            <div style={{ flex: "1" }}>
              <select
                value={selectedPatientName}
                onChange={(e) => {
                  const name = e.target.value;
                  setSelectedPatientName(name);
                  const appointment = filteredAppointmentsByDate.find(
                    (appt) => appt.patientName === name
                  );
                  setSelectedAppointment(appointment || null);
                  if (appointment?.patientId) {
                    fetchPatientHistory(appointment.patientId);
                  }
                }}
                style={{ width: "100%" }}
              >
                <option value="">Select Patient</option>
                {[...new Set(filteredAppointmentsByDate.map((appt) => appt.patientName))].map(
                  (name, idx) => (
                    <option key={idx} value={name}>
                      {name}
                    </option>
                  )
                )}
              </select>
            </div>
          )}
        </div>

        {selectedAppointment && (
          <div style={{ marginTop: "30px" }}>
            <hr style={{ marginBottom: "20px" }} />
            <h3>Write Prescription for {selectedAppointment.patientName}</h3>

            <input
              type="text"
              placeholder="Symptoms"
              value={prescriptionData.symptoms}
              onChange={(e) =>
                setPrescriptionData({ ...prescriptionData, symptoms: e.target.value })
              }
              style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
            />

            <input
              type="text"
              placeholder="Diagnosis"
              value={prescriptionData.diagnosis}
              onChange={(e) =>
                setPrescriptionData({ ...prescriptionData, diagnosis: e.target.value })
              }
              style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
            />

            <input
              type="number"
              placeholder="Pulse Rate"
              value={prescriptionData.pulseRate}
              onChange={(e) =>
                setPrescriptionData({ ...prescriptionData, pulseRate: e.target.value })
              }
              style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
            />

            <h4>Medications</h4>
            {prescriptionData.medications.map((med, index) => (
              <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }} key={index}>
                <input
                  type="text"
                  placeholder="Name"
                  value={med.name}
                  onChange={(e) => handleMedicationChange(index, "name", e.target.value)}
                  style={{ width: "20%", padding: "10px" }}
                />
                <input
                  type="text"
                  placeholder="Dosage"
                  value={med.dosage}
                  onChange={(e) => handleMedicationChange(index, "dosage", e.target.value)}
                  style={{ width: "20%", padding: "10px" }}
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={med.quantity}
                  onChange={(e) => handleMedicationChange(index, "quantity", e.target.value)}
                  style={{ width: "20%", padding: "10px" }}
                />
                <input
                  type="text"
                  placeholder="Instructions"
                  value={med.instructions}
                  onChange={(e) => handleMedicationChange(index, "instructions", e.target.value)}
                  style={{ width: "35%", padding: "10px" }}
                />
              </div>
            ))}

            <button onClick={handleAddMedication} style={{ padding: "10px 20px", marginBottom: "20px" }}>
              + Add Medication
            </button>

            <input
              type="date"
              placeholder="Next Visit"
              value={prescriptionData.nextvisit}
              onChange={(e) =>
                setPrescriptionData({ ...prescriptionData, nextvisit: e.target.value })
              }
              style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
            />

            <textarea
              placeholder="Medical History Notes"
              value={prescriptionData.medicalhistory}
              onChange={(e) =>
                setPrescriptionData({ ...prescriptionData, medicalhistory: e.target.value })
              }
              style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
            />

            <input
              type="number"
              placeholder="Billing Amount (₹)"
              value={prescriptionData.billingAmount || ""}
              onChange={(e) =>
                setPrescriptionData({ ...prescriptionData, billingAmount: e.target.value })
              }
              style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
            />

            <button
              onClick={submitPrescription}
              style={{
                backgroundColor: "#4CAF50",
                color: "#fff",
                padding: "10px 20px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Submit Prescription
            </button>

            {patientPrescriptions.length > 0 && selectedAppointment && (
              <div style={{ marginTop: "30px" }}>
                <h3>Patient's Medical History</h3>
                {patientPrescriptions
                  .filter(
                    (presc) =>
                      presc.patientName === selectedAppointment.patientName &&
                      (!presc.appointmentId || presc.appointmentId === selectedAppointment._id)
                  )
                  .map((presc) => (
                    <div key={presc._id} style={{ marginBottom: "15px" }}>
                      <p>
                        <strong>{new Date(presc.dateIssued).toLocaleDateString()}</strong> –{" "}
                        {presc.diagnosis || "No diagnosis"} ({presc.symptoms || "No symptoms"})
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPrescription;
