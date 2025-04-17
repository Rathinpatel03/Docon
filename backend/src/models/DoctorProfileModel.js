const mongoose = require("mongoose")
const Schema = mongoose.Schema

const doctorprofileSchema = new Schema({

    doctorname:{
        type:String
    },
    specialization:{
        type:String
    },
    qualification:{
        type:String
    },
    experience:{
        type:Number
    },
    status:{
        type:Boolean,
        default:true
    },
    userId:{
        type:Schema.Types.ObjectId, 
        ref:"admin"
    },
    email:{
        type:String,
        unique:true
    },
    profile_pic:{
        type:String,
    },
    medicalRegistrationNumber:{
        type:Number,
    },
    medicalCouncil:{
        type:String,
    },
    educationalCollege:{
        type:String,
    },
    dateofbirth:{
        type:Date,
    },
    about:{
        type:String,
    },

},{
        timestamps: true
    })

module.exports = mongoose.model("Doctors",doctorprofileSchema)