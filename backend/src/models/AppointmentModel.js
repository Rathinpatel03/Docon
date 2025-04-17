const mongoose = require("mongoose")
const Schema = mongoose.Schema

const appointmentSchema = new Schema({

    patientName:{
        type:String,
    },
    patientAge:{
        type:Number,
    },
    patientId:{
        type:Schema.Types.ObjectId, 
        ref:"patient"
    },
    doctorprofileId:{
        type:Schema.Types.ObjectId, 
        ref:"doctor"
    },
    reference:{
        type:String,
    },
    complain:{
        type:String,
    },
    appointmenttime: {
        type: String,
        enum: ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM","05:00 PM","06:00 PM","07:00 PM"], 
    },appointmentType: { 
        type: String,
        enum: ['Online', 'Offline'], 
        default: 'Offline', 
    },
    appointmentdate:{
        type:Date,
    },
    cancelReason:{
        type:String,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "declined","complete"],
        default: "pending"
    },    
    patientEmail:{
        type:String,
    }
},{
        timestamps: true
    })

module.exports = mongoose.model("Appointment",appointmentSchema)