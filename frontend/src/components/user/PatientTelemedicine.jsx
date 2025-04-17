import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const PatientTelemedicine = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDoctorUserId, setSelectedDoctorUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [doctorNames, setDoctorNames] = useState({});
  const [userIdsMap, setUserIdsMap] = useState({});
  const patientId = localStorage.getItem("id");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (patientId) {
      fetchAppointments(patientId);
    }
  }, [patientId]);

  const fetchAppointments = async (id) => {
    try {
      const res = await axios.get(`/appointment/patient/${id}`);
      const onlineAppointments = res.data.data.filter(
        (appt) => appt.appointmentType === "Online"
      );
      setAppointments(onlineAppointments);

      const uniqueDoctorProfileIds = [...new Set(onlineAppointments.map(appt => appt.doctorprofileId))];
      const namesMap = {};
      const userMap = {};

      await Promise.all(
        uniqueDoctorProfileIds.map(async (profileId) => {
          try {
            const res = await axios.get(`/doctorprofile/doctor/${profileId}`);
            const data = res.data.data;
            namesMap[profileId] = data.doctorname || "Unknown";
            userMap[profileId] = data.userId;
          } catch (err) {
            console.error(`Failed to fetch doctor profile ${profileId}:`, err);
            namesMap[profileId] = "Unknown";
            userMap[profileId] = null;
          }
        })
      );

      setDoctorNames(namesMap);
      setUserIdsMap(userMap);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  const openChat = async (doctorUserId) => {
    setSelectedDoctorUserId(doctorUserId);
    try {
      const res = await axios.get(`/chat/messages/${patientId}/${doctorUserId}`);
      const sorted = res.data.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
      setMessages(sorted);
      scrollToBottom();
    } catch (err) {
      console.error("Error loading chat:", err);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    const message = {
      senderId: patientId,
      receiverId: selectedDoctorUserId,
      text,
      timestamp: new Date().toISOString(),
    };

    try {
      await axios.post("/chat/send", message);
      setMessages((prev) => [...prev, message]);
      setText("");
      scrollToBottom();
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const selectedDoctorProfileId = Object.entries(userIdsMap).find(
    ([, uid]) => uid === selectedDoctorUserId
  )?.[0];

  return (
    <div className="container mt-4 p-4 bg-light rounded shadow">
      <h2 className="mb-3 text-center">Patient Telemedicine</h2>
      <p className="text-muted text-center">
        View your <strong>online</strong> appointments and chat with your doctor.
      </p>

      <table className="table table-bordered table-hover mt-3">
        <thead className="table-dark">
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Doctor</th>
            <th>Type</th>
            <th>Status</th>
            <th>Chat</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr key={appt._id}>
              <td>{new Date(appt.appointmentdate).toLocaleDateString()}</td>
              <td>{appt.appointmenttime}</td>
              <td>{doctorNames[appt.doctorprofileId] || "Loading..."}</td>
              <td>{appt.appointmentType}</td>
              <td>{appt.status}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => openChat(userIdsMap[appt.doctorprofileId])}
                  disabled={!userIdsMap[appt.doctorprofileId]}
                >
                  Chat
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedDoctorUserId && (
        <div className="card direct-chat direct-chat-primary mt-5">
          <div className="card-header">
            <h3 className="card-title">
              Chat with {doctorNames[selectedDoctorProfileId] || "Doctor"}
            </h3>
            <div className="card-tools">
              <span className="badge badge-primary">{messages.length}</span>
              <button type="button" className="btn btn-tool">
                <i className="fas fa-minus" />
              </button>
              <button type="button" className="btn btn-tool" title="Contacts">
                <i className="fas fa-comments" />
              </button>
              <button type="button" className="btn btn-tool">
                <i className="fas fa-times" />
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="direct-chat-messages" style={{ height: "400px", overflowY: "auto" }}>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`direct-chat-msg ${msg.senderId === patientId ? "right" : ""}`}
                >
                  <div className="direct-chat-infos clearfix">
                    <span
                      className={`direct-chat-name ${
                        msg.senderId === patientId ? "float-right" : "float-left"
                      }`}
                    >
                      {msg.senderId === patientId ? "You" : doctorNames[selectedDoctorProfileId]}
                    </span>
                    <span
                      className={`direct-chat-timestamp ${
                        msg.senderId === patientId ? "float-left" : "float-right"
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <img
                    className="direct-chat-img"
                    src={
                      msg.senderId === patientId
                        ? "https://via.placeholder.com/128/5bc0de/fff?text=You"
                        : "https://via.placeholder.com/128/f4645f/fff?text=Dr"
                    }
                    alt="User"
                  />
                  <div className="direct-chat-text">{msg.text}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <div className="card-footer">
            <div className="input-group">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type Message ..."
                className="form-control"
              />
              <span className="input-group-append">
                <button onClick={sendMessage} className="btn btn-primary">
                  Send
                </button>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientTelemedicine;