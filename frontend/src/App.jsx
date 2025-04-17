import "./assets/css/adminlte.css"
import "./assets/css/adminlte.min.css"
import { Route, Routes, useLocation } from 'react-router-dom'
import { AdminSidebar } from './components/layouts/AdminSidebar'
import { DoctorSidebar } from './components/layouts/DoctorSidebar'
import { Login } from "./components/common/Login"
import { Signup } from "./components/common/Signup"
import axios from "axios"
import { useEffect } from "react"
import { DoctorProfile } from "./components/admin/DoctorProfile"
import { ViewDoctorProfile } from "./components/admin/ViewDoctorProfile"
import { UserSidebar } from './components/layouts/Usersidebar'
import LandingPage from "./components/common/LandingPage"
import { Appointment } from "./components/user/Appointment"
import { ViewAppointment } from "./components/user/ViewAppointment"
import { Myappointments } from "./components/doctor/Myappointments"
import DoctorPrescription from "./components/doctor/DoctorPrescription"
import Prescription from "./components/user/Prescription"
import DoctorTelemedicine from "./components/doctor/DoctorTelemedicine"
import PatientTelemedicine from "./components/user/PatientTelemedicine"
import PatientReminder from "./components/user/PatientReminder"
import DoctorDashboard  from "./components/doctor/DoctorDashboard"
import AdminDashboard  from "./components/admin/AdminDashboard"
import UserDashboard  from "./components/user/UserDashboard"
import AdminEHR from "./components/admin/AdminEHR"
import ViewPatient from "./components/admin/ViewPatient"
import { UpdateDoctorProfile } from "./components/admin/UpdateDoctorProfile"
import PrivateRoutes from "./components/hooks/PrivateRoutes"
import { ResetPassword } from "./components/common/ResetPassword"
import { ForgotPassword } from "./components/common/ForgotPassword"

function App() {
  axios.defaults.baseURL = "http://localhost:3000";
  
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/login" || location.pathname === "/signup") {
      document.body.className = ""; // Remove the unwanted class for login and signup
    } else {
      document.body.className =
        "layout-fixed sidebar-expand-lg bg-body-tertiary sidebar-open app-loaded";
    }
  }, [location.pathname]);

  return (
   
    <div className={location.pathname === "/login" || location.pathname === "/signup" ? "" : "app-wrapper"}>
    <Routes> 
  
  <Route path="/login" element={<Login/>}></Route>
  <Route path="/signup" element={<Signup/>}></Route>
  <Route path="/" element ={<LandingPage/>}></Route>
<Route path='/resetpassword/:token' element = {<ResetPassword/>}></Route>
<Route path='/forgetpassword' element = {<ForgotPassword/>}></Route>
  <Route path="" element={<PrivateRoutes></PrivateRoutes>}>
  <Route path='/user' element ={<UserSidebar/>}>
  <Route path='' element ={<UserDashboard/>}></Route>
  <Route path='addappointment' element ={<Appointment/>}></Route>
  <Route path='viewappointment' element ={<ViewAppointment/>}></Route>
  <Route path="prescription" element = {<Prescription/>}></Route>
  <Route path="patienttelemedicine" element = {<PatientTelemedicine/>}></Route>
  <Route path="patientreminder" element = {<PatientReminder/>}></Route>
  </Route>
  <Route path='/admin' element ={<AdminSidebar/>}>
  <Route path='' element ={<AdminDashboard/>}></Route>
  <Route path='adddoctorprofile' element ={<DoctorProfile/>}></Route>
  <Route path='viewdoctorprofile' element ={<ViewDoctorProfile/>}></Route>
  <Route path="update-doctor/:id" element={<UpdateDoctorProfile />} />
  <Route path="adminehr" element ={<AdminEHR/>}></Route>
  <Route path='viewpatient' element ={<ViewPatient/>}></Route>
  </Route>
  <Route path='/doctor' element ={<DoctorSidebar/>}>
  <Route path='' element ={<DoctorDashboard/>}></Route>
  <Route path='myappointments' element ={<Myappointments/>}></Route>
  <Route path='doctorprescription' element ={<DoctorPrescription/>}></Route>
  <Route path="doctortelemedicine" element = {<DoctorTelemedicine/>}></Route>
  </Route>
  </Route>
  </Routes>
   </div>
  )
}

export default App;