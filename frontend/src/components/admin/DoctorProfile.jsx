import axios from 'axios';
import React from 'react'
import { useForm } from 'react-hook-form';

export const DoctorProfile = () => {
    const { register, handleSubmit } = useForm();

  const submitHandler = async (data) => {

    const userId = localStorage.getItem("id")
    data.userId = userId;
    console.log(data);
    console.log(data.image[0]) //array -->0th index access..

    const formData = new FormData();
    formData.append("doctorname",data.doctorname);
    formData.append("specialization",data.specialization); 
    formData.append("qualification",data.qualification);
    formData.append("experience",data.experience);
    formData.append("email",data.email);
    formData.append("image",data.image[0]);
    formData.append("userId",data.userId);
    formData.append("medicalRegistrationNumber",data.medicalRegistrationNumber);
    formData.append("medicalCouncil",data.medicalCouncil);
    formData.append("educationalCollege",data.educationalCollege);
    formData.append("dateofbirth",data.dateofbirth);

  const res = await axios.post("/doctorprofile/addDoctorProfileWithFile", formData);
  console.log(res); //axios
  console.log(res.data); //api response
  //if else...
  navigate("/admin/viewdoctorprofile")
};
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card p-4 shadow">
            <h2 className="text-center mb-4">Doctor Profile</h2>
  
        <form onSubmit={handleSubmit(submitHandler)}>
        <div className="mb-3">
        <label className="form-label">Doctor Name</label>
        <input type="text" className="form-control" {...register("doctorname")}></input>
        </div>
        <div className="mb-3">
        <label className="form-label">Date of Birth</label>
        <input type="date" className="form-control" {...register("dateofbirth")}></input>
        </div>
        <div className="mb-3">
        <label className="form-label">Specialization</label>
            <input type='text' className="form-control" {...register("specialization")}></input>
            </div>
            <div className="mb-3">
            <label className="form-label">Experience</label>
            <input type='number' className="form-control" {...register("experience")}></input>
        </div>
        <div className="mb-3">
        <label className="form-label">Medical Registration Number</label>
            <input type='number' className="form-control" {...register("medicalRegistrationNumber")}></input>
        </div>
        <div className="mb-3">
        <label className="form-label">Medical Council</label>
            <input type='text' className="form-control" {...register("medicalCouncil")}></input>
        </div>
        <div className="mb-3">
        <label className="form-label">Educational College</label>
            <input type='text' className="form-control" {...register("educationalCollege")}></input>
        </div>
        <div className="mb-3">
        <label className="form-label">Qualification</label>
            <input type='text' className="form-control" {...register("qualification")}></input>
        </div>
        <div className="mb-3">
        <label className="form-label">Email</label>
            <input type='text' className="form-control" {...register("email")}></input>
        </div>
        <div className="mb-3">
        <label className="form-label">Doctor profile Pic</label>
            <input type='file' className="form-control" {...register("image")}></input>
        </div>
        <div className="mb-3">
        <label className="form-label">About</label>
            <input type='text' className="form-control" {...register("about")}></input>
        </div>
        <button type="submit" className="btn btn-primary w-100">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};