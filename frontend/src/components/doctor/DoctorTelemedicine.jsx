import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const DoctorTelemedicine = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [chatReceiverId, setChatReceiverId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const messagesEndRef = useRef(null);
  const doctorEmail = localStorage.getItem("email");

  useEffect(() => {
    if (doctorEmail) {
      fetchDoctorProfile();
    }
  }, [doctorEmail]);

  const fetchDoctorProfile = async () => {
    try {
      const res = await axios.get(`/doctorprofile/myprofile/${doctorEmail}`);
      const docData = res.data.data;

      if (docData) {
        setDoctorId(docData.userId);
        localStorage.setItem("senderId", docData.userId);
        fetchAppointments(docData._id);
      }
    } catch (err) {
      console.error("Error fetching doctor profile:", err);
    }
  };

  const fetchAppointments = async (id) => {
    try {
      const res = await axios.get(`/appointment/doctor/appointments/${id}`);
      const onlineAppointments = res.data.data.filter(
        (appt) => appt.appointmentType === "Online"
      );
      setAppointments(onlineAppointments);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  const openChat = async (receiverId) => {
    setChatReceiverId(receiverId);
    try {
      const res = await axios.get(`/chat/messages/${doctorId}/${receiverId}`);
      const sortedMessages = res.data.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
      setMessages(sortedMessages);
      scrollToBottom();
    } catch (err) {
      console.error("Error loading chat messages:", err);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    const message = {
      senderId: doctorId,
      receiverId: chatReceiverId,
      text,
      timestamp: new Date().toISOString(),
    };

    try {
      await axios.post("/chat/send", message);
      setMessages((prev) => [...prev, message]);
      setText("");
      scrollToBottom();
    } catch (err) {
      console.error("Send message failed:", err);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="container mt-4 p-4 bg-light rounded shadow">
      <h2 className="mb-3 text-center">Doctor Telemedicine</h2>
      <p className="text-muted text-center">
        View approved <strong>online</strong> appointments and chat with your patients.
      </p>

      <table className="table table-bordered table-hover mt-3">
        <thead className="table-dark">
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Patient</th>
            <th>Type</th>
            <th>Status</th>
            <th>Chat</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">No online appointments found.</td>
            </tr>
          ) : (
            appointments.map((appt) => (
              <tr key={appt._id}>
                <td>{new Date(appt.appointmentdate).toLocaleDateString()}</td>
                <td>{appt.appointmenttime}</td>
                <td>{appt.patientName || "Unknown"}</td>
                <td>{appt.appointmentType}</td>
                <td>{appt.status}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => openChat(appt.patientId)}
                  >
                    Chat
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Direct Chat UI */}
      {chatReceiverId && (
        <div className="card direct-chat direct-chat-primary mt-5">
          <div className="card-header ui-sortable-handle">
            <h3 className="card-title">Direct Chat</h3>
           
          </div>

          <div className="card-body">
            <div className="direct-chat-messages" style={{ height: "400px", overflowY: "scroll" }}>
              {messages.map((msg, idx) => {
                const isDoctor = msg.senderId === doctorId;
                return (
                  <div
                    key={idx}
                    className={`direct-chat-msg ${isDoctor ? "right" : ""}`}
                  >
                    <div className="direct-chat-infos clearfix">
                      <span className={`direct-chat-name float-${isDoctor ? "right" : "left"}`}>
                        {isDoctor ? "Doctor" : "Patient"}
                      </span>
                      <span className={`direct-chat-timestamp float-${isDoctor ? "left" : "right"}`}>
                        {new Date(msg.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <img
                      className="direct-chat-img"
                      src={`https://ui-avatars.com/api/?name=${isDoctor ? "Doctor" : "Patient"}`}
                      alt="user avatar"
                    />
                    <div className="direct-chat-text">{msg.text}</div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="card-footer">
            <div className="input-group">
              <input
                type="text"
                name="message"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type Message ..."
                className="form-control"
              />
              <span className="input-group-append">
                <button type="button" className="btn btn-primary" onClick={sendMessage}>
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

export default DoctorTelemedicine;