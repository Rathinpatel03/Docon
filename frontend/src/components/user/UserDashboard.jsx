import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import SymptomChecker from './SymptomChecker';
import { Chart as ChartJS, CategoryScale,  LinearScale,  PointElement,  LineElement,  Title,  Tooltip, Legend} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const UserDashboard = () => {
  const [pulseData, setPulseData] = useState([]);
  const [nextVisit, setNextVisit] = useState(null);
  const [pendingBills, setPendingBills] = useState([]);
  const [nextAppointment, setNextAppointment] = useState(null);
  const patientId = localStorage.getItem("id");

  const totalPendingAmount = pendingBills.reduce((sum, bill) => {
    const amount = parseFloat(bill.amount || 0); // Ensure your API provides 'amount'
    return sum + amount;
  }, 0);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await axios.get(`/eprescription/patient/${patientId}`);
        const data = res.data.data || [];

        const pulsePoints = data
          .filter(p => p.pulseRate)
          .map(p => ({
            date: new Date(p.createdAt).toLocaleDateString(),
            pulse: parseInt(p.pulseRate),
          }));

        setPulseData(pulsePoints);

        const futureVisits = data
          .filter(p => p.nextvisit)
          .map(p => new Date(p.nextvisit))
          .filter(date => date > new Date());

        const next = futureVisits.sort((a, b) => a - b)[0];
        setNextVisit(next ? next.toLocaleDateString() : "Not Scheduled");

        const unpaid = data.filter(p => p.paymentStatus !== "paid");
        setPendingBills(unpaid);
      } catch (err) {
        console.error("Error fetching prescriptions:", err);
      }
    };

    const fetchAppointments = async () => {
      try {
        const res = await axios.get(`/appointment/patient/${patientId}`);
        const appointments = res.data.data || [];

        const approved = appointments
          .filter(a => a.status === "Approved")
          .sort((a, b) => new Date(a.appointmentdate) - new Date(b.appointmentdate));

        if (approved.length > 0) {
          const next = approved[0];
          try {
            const docRes = await axios.get(`/doctorprofile/doctor/${next.doctorprofileId}`);
            const doctorName = docRes.data.data?.doctorname || "Doctor";
            setNextAppointment({
              date: new Date(next.appointmentdate).toLocaleDateString(),
              time: next.appointmenttime,
              doctor: doctorName,
            });
          } catch {
            setNextAppointment({
              date: new Date(next.appointmentdate).toLocaleDateString(),
              time: next.appointmenttime,
              doctor: "Doctor",
            });
          }
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };

    if (patientId) {
      fetchPrescriptions();
      fetchAppointments();
    }
  }, [patientId]);

  const chartData = {
    labels: pulseData.map(d => d.date),
    datasets: [
      {
        label: 'Pulse Rate',
        data: pulseData.map(d => d.pulse),
        borderColor: '#ef5350',
        backgroundColor: 'rgba(239, 83, 80, 0.2)',
        tension: 0.3,
        fill: true,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Pulse Rate Over Time' },
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: 120
      }
    }
  };

  return (
    <div className="content-wrapper p-3">
      <section className="content-header">
        <h1 className="text-center text-primary font-weight-bold">
          <i className="fas fa-user-md mr-2"></i>Patient Dashboard
        </h1>
      </section>

      <section className="content">
        <div className="container-fluid">
          <div className="row gy-4">
            {/* Alert for Pending Bills */}
            {pendingBills.length > 0 && (
              <div className="col-12">
                <div className="alert alert-danger">
                  <h5>
                    <i className="icon fas fa-exclamation-triangle"></i> Pending Bills
                  </h5>
                  You have {pendingBills.length} unpaid bill{pendingBills.length > 1 ? 's' : ''}. Please complete them to avoid issues.
                </div>
              </div>
            )}

            {/* Total Payable Amount */}
            <div className="col-12 col-sm-6 col-lg-4">
              <div className="card card-warning h-100">
                <div className="card-header">
                  <h3 className="card-title">Total Payable Amount</h3>
                </div>
                <div className="card-body text-center">
                  <h2 className="text-warning font-weight-bold">₹ {totalPendingAmount.toFixed(2)}</h2>
                </div>
              </div>
            </div>

            {/* Symptom Checker */}
            <div className="col-12 col-lg-8">
              <div className="card card-info h-100">
                <div className="card-header">
                  <h3 className="card-title">Symptom Checker</h3>
                </div>
                <div className="card-body">
                  <SymptomChecker />
                </div>
              </div>
            </div>

            {/* Pulse Rate Chart */}
            <div className="col-12 col-md-6">
              <div className="card card-danger h-100">
                <div className="card-header">
                  <h3 className="card-title">Pulse Rate</h3>
                </div>
                <div className="card-body">
                  {pulseData.length > 0 ? (
                    <div style={{ height: "200px" }}>
                      <Line data={chartData} options={chartOptions} />
                    </div>
                  ) : (
                    <p className="text-muted small">No pulse data available.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Upcoming Visit */}
            {nextAppointment && (
              <div className="col-12 col-md-6">
                <div className="card card-primary h-100">
                  <div className="card-header">
                    <h3 className="card-title">Upcoming Visit</h3>
                  </div>
                  <div className="card-body">
                    <h5 className="text-dark">{nextVisit}</h5>
                    <h5><strong>Doctor:</strong> {nextAppointment.doctor}</h5>
                    <h5><strong>Medical History:</strong> {nextAppointment.medicalhistory || "N/A"}</h5>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;