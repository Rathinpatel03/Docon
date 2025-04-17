const routes = require("express").Router()
const { updateAppointmentStatus } = require("../controllers/AppointmentController");
const appointmentController = require("../controllers/AppointmentController")

routes.get("/allAppointment",appointmentController.getAppointments)
routes.post("/addAppointment",appointmentController.addAppointment)
routes.get("/doctor/appointments/:doctorId", appointmentController.getAppointmentsByDoctorID);
routes.put("/update/:id", updateAppointmentStatus); 
routes.get("/patient/:patientId", appointmentController.getAppointmentsByPatientID);
module.exports = routes