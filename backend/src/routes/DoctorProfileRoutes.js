const routes = require("express").Router();

const doctorprofileController = require("../controllers/DoctorProfileController");

routes.get("/allDoctor", doctorprofileController.getAllDoctor);
routes.post("/addDoctor", doctorprofileController.addDoctor);
routes.post("/addDoctorprofilewithfile", doctorprofileController.addDoctorProfileWithFile);
routes.get("/myprofile/:email", doctorprofileController.getDoctorProfileByEmail);
routes.put("/update/:id", doctorprofileController.updateDoctorProfile);
routes.get("/doctor/:id", doctorprofileController.getDoctorProfileById);
routes.delete("/delete/:id", doctorprofileController.deleteDoctorProfile); // <- Added this line

module.exports = routes;