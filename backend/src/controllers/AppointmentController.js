const appointmentModel = require("../models/AppointmentModel");
const nodemailer = require("nodemailer"); 

const addAppointment = async (req, res) => {
  console.log("Req.body  : ",req.body)
  try {
    const savedapp = await appointmentModel.create(req.body);
    res.status(201).json({
      message: "appoinment added successfully",
      data: savedapp,
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server Error ",
      data :err
    });
  }
};

const getAppointments = async (req, res) => {
  try {
    const Appointment = await appointmentModel.find();
    res.status(200).json({
      message: "All appointment",
      data: Appointment,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "internal server error", data: err });
  }
};

const getAppointmentsByDoctorID = async (req, res) => {
  try {
    const { doctorId } = req.params;

    // Check if doctorId is valid
    if (!doctorId) {
      return res.status(400).json({ message: "Doctor ID is required" });
    }

    // Fetch appointments
    const appointments = await appointmentModel
      .find({ doctorprofileId: doctorId })
      .exec();

  
    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found for this doctor" });
    }

    res.status(200).json({
      message: "Doctor's Appointments",
      data: appointments,
    });
  } catch (err) {
    console.error("Error fetching doctor appointments:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
     user:"rplearner01@gmail.com",
     pass:""
  },
});

const updateAppointmentStatus = async (req, res) => {
  try {
      const { id } = req.params;
      const { status, cancelReason } = req.body;

      if (!id) return res.status(400).json({ message: "Appointment ID is required" });

      let updateData = { status };
      if (status === "Declined") updateData.cancelReason = cancelReason;

      const appointment = await appointmentModel.findByIdAndUpdate(
          id,
          updateData,
          { new: true }
      );

      if (!appointment) {
          return res.status(404).json({ message: "Appointment not found" });
      }

      // Email Notification
      let mailOptions = {
          from: "rplearner01@gmail.com",
          to: appointment.patientEmail,
          subject: `Appointment ${status}`,
          text: `Dear ${appointment.patientName},\n\nYour appointment on ${appointment.appointmentdate} has been ${status}.`
      };

      if (status === "Declined") {
          mailOptions.text += `\n\nReason: ${cancelReason}`;
      }

      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: `Appointment ${status} & Email Sent`, data: appointment });
  } catch (error) {
      res.status(500).json({ message: "Error updating appointment", error });
  }
};

const getAppointmentsByPatientID = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({ message: "Patient ID is required" });
    }

    const appointments = await appointmentModel.find({ patientId }).exec();

    res.status(200).json({
      message: "Patient's Appointments",
      data: appointments,
    });
  } catch (err) {
    console.error("Error fetching patient appointments:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};



module.exports = { addAppointment, getAppointments,updateAppointmentStatus, getAppointmentsByDoctorID,getAppointmentsByPatientID,};