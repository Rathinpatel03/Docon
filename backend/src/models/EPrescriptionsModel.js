const mongoose = require('mongoose');

const ePrescriptionSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true
  },
  patientEmail: {
    type: String,

  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctors', 
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  medications: [
    {
      name: {
        type: String,
      },
      dosage: {
        type: String,
      },
      quantity: {
        type: Number,
      },
      instructions: {
        type: String
      },
    }
  ],
  dateIssued: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'compleate', 'rejected'],
    default: 'pending'
  },
  pharmacy: {
    type: String,
  },
  symptoms: {
    type: String, // Example: "Fever, cough, headache"
  },
  diagnosis: {
    type: String, // Example: "Viral Fever",
  },
  pulseRate: {
    type: Number, // Example: 72
  },
  nextvisit:{
    type:Date,
},
medicalhistory:{
  type:String,
},
paymentStatus: { type: String, default: "unpaid" },
paymentId: { type: String },
billingAmount: { type: Number, default: 500 },
});

const EPrescription = mongoose.model('EPrescription', ePrescriptionSchema);

module.exports = EPrescription;