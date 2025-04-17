const doctorprofileModel = require("../models/DoctorProfileModel");
const multer = require("multer");
const path = require("path");
const cloudinaryUtil = require("../utils/CloudinaryUtil");

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  //fileFilter:
}).single("image");

const getAllDoctor = async (req, res) => {
 try{
    const alldoctor = await doctorprofileModel.find()
    res.json({
        message: "doctor profiled fetched successfully",
        data: alldoctor})

    }catch(err){

        res.status(500).json({
            message: err
        })
    }
};

const addDoctor = async (req, res) => {
  try {
    const saveddp = await doctorprofileModel.create(req.body);
    res.status(201).json({
      message: "doctor added successfully",
      data: saveddp,
    });
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
}


const addDoctorProfileWithFile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        message: err.message,
      });
    } else {

      const cloundinaryResponse = await cloudinaryUtil.uploadFileToCloudinary(req.file);
      console.log(cloundinaryResponse);
      console.log(req.body);


      req.body.profile_pic = cloundinaryResponse.secure_url
      const savedDoctor = await doctorprofileModel.create(req.body);

      res.status(200).json({
        message: "doctor saved successfully",
        data: savedDoctor
      });
    }
  });
};
const getDoctorProfileByEmail = async (req, res) => {
  const { email } = req.params;
  if (!email) {
    return res.status(400).json({ message: "Email parameter is required" });
  }
  try {
    const doctorProfile = await doctorprofileModel.findOne({ email });

    if (!doctorProfile) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    res.status(200).json({
      message: "Doctor profile fetched successfully",
      data: doctorProfile
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err.message
    });
  }
};

const updateDoctorProfile = async (req, res) => {
  try {
      const updatedDoctor = await doctorprofileModel.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true } // Return the updated profile
      );

      if (!updatedDoctor) {
          return res.status(404).json({ message: "Doctor profile not found" });
      }

      res.status(200).json({
          message: "Doctor profile updated successfully",
          data: updatedDoctor
      });
  } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
  }
};
const getDoctorProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Doctor ID is required" });
    }
    const doctorProfile = await doctorprofileModel.findById(id);
    if (!doctorProfile) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }
    res.status(200).json({
      message: "Doctor profile fetched successfully",
      data: doctorProfile,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};
const deleteDoctorProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDoctor = await doctorprofileModel.findByIdAndDelete(id);

    if (!deletedDoctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    res.status(200).json({
      message: "Doctor profile deleted successfully",
      data: deletedDoctor
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err.message
    });
  }
};

module.exports = {
  getAllDoctor,
  addDoctor,
  addDoctorProfileWithFile,
  getDoctorProfileByEmail,
  updateDoctorProfile,
  getDoctorProfileById,
  deleteDoctorProfile,
};