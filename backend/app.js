const express = require("express") 
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()
app.use(cors()) 
app.use(express.json()) 

const roleRoutes = require("./src/routes/RoleRoutes")
app.use(roleRoutes)

const userRoutes = require("./src/routes/UserRoutes")
app.use(userRoutes)

const doctorprofileRoutes = require("./src/routes/DoctorProfileRoutes")
app.use("/doctorprofile",doctorprofileRoutes)

const appointmentRoutes = require("./src/routes/AppointmentRoutes")
app.use("/appointment",appointmentRoutes)

const ePrescriptionRoutes = require('./src/routes/EPrescriptionsRoutes');
app.use('/eprescription', ePrescriptionRoutes);

const chatRoutes = require('./src/routes/ChatRoutes');
app.use('/chat', chatRoutes);


mongoose.connect("mongodb://127.0.0.1:27017/docon").then(()=>{
    console.log("database connected....")
})


const PORT = 3000
app.listen(PORT,()=>{
    console.log("server started on port number ",PORT)
})