const EPrescription = require('../models/EPrescriptionsModel');
require("../models/DoctorProfileModel");
require("../models/UserModel");
const nodemailer = require("nodemailer");

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rplearner01@gmail.com",
    pass: ""
  },
});

// Create a new prescription
exports.createPrescription = async (req, res) => {
  try {
    const {
      patientName, patientId, doctorId, symptoms,
      diagnosis, pulseRate, medications, pharmacy, nextvisit
    } = req.body;

    if (!patientId || !doctorId) {
      return res.status(400).json({ message: "Patient ID and Doctor ID are required." });
    }

    const newPrescription = new EPrescription({
      patientName, patientId, doctorId, symptoms,
      diagnosis, pulseRate, medications, pharmacy, nextvisit,
    });

    await newPrescription.save();
    res.status(201).json({ message: "Prescription created successfully.", data: newPrescription });
  } catch (error) {
    console.error("Error creating prescription:", error);
    res.status(500).json({ message: "Server error while creating prescription." });
  }
};

// Get all prescriptions
exports.getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await EPrescription.find()
      .populate("doctorId", "doctorname email specialization")
      .populate("patientId", "name email");

    const formatted = prescriptions.map((presc) => ({
      _id: presc._id,
      dateIssued: presc.dateIssued,
      nextvisit: presc.nextvisit,
      symptoms: presc.symptoms,
      diagnosis: presc.diagnosis,
      pulseRate: presc.pulseRate,
      medications: presc.medications,
      medicalhistory: presc.medicalhistory,

      patientName: presc.patientName || presc.patientId?.name || "N/A",
      patientEmail: presc.patientId?.email || "N/A",

      doctorName: presc.doctorId?.doctorname || "N/A",
      doctorEmail: presc.doctorId?.email || "N/A",
      doctorSpecialization: presc.doctorId?.specialization || "N/A",
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("Admin getAllPrescriptions error:", err);
    res.status(500).json({ message: "Error fetching prescriptions", error: err.message });
  }
};


// Get prescription by ID
exports.getPrescriptionById = async (req, res) => {
  try {
    const prescription = await EPrescription.findById(req.params.id).populate('doctorId', 'name email');
    if (!prescription) return res.status(404).json({ message: 'Prescription not found' });
    res.status(200).json(prescription);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching prescription', error: err.message });
  }
};

// Delete prescription
exports.deletePrescription = async (req, res) => {
  try {
    const prescription = await EPrescription.findByIdAndDelete(req.params.id);
    if (!prescription) return res.status(404).json({ message: 'Prescription not found' });
    res.status(200).json({ message: 'Prescription deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting prescription', error: err.message });
  }
};

// Get prescriptions by patient
exports.getPrescriptionsByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    if (!patientId) return res.status(400).json({ message: "Patient ID is required." });

    const prescriptions = await EPrescription.find({ patientId });
    if (!prescriptions.length) return res.status(404).json({ message: "No prescriptions found for this patient." });

    res.status(200).json({ data: prescriptions });
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    res.status(500).json({ message: "Server error while fetching prescriptions." });
  }
};

// Get prescriptions by doctor
exports.getPrescriptionsByDoctorId = async (req, res) => {
  try {
    const { doctorId } = req.params;
    if (!doctorId) return res.status(400).json({ message: "Doctor ID is required." });

    const prescriptions = await EPrescription.find({ doctorId });
    res.status(200).json({ data: prescriptions });
  } catch (error) {
    console.error("Error fetching doctor's prescriptions:", error);
    res.status(500).json({ message: "Server error while fetching prescriptions." });
  }
};

// Email Reminder Toggle
exports.toggleEmailReminder = async (req, res) => {
  try {
    const { patientId, enabled } = req.body;

    if (!patientId) return res.status(400).json({ message: "Patient ID is required." });

    // Save the preference (you'd update actual User/Patient model here)
    // Example: await User.findByIdAndUpdate(patientId, { emailRemindersEnabled: enabled });

    res.status(200).json({ message: `Email reminders ${enabled ? 'enabled' : 'disabled'}` });
  } catch (err) {
    console.error("Error toggling email reminder:", err);
    res.status(500).json({ message: "Failed to update email reminder setting." });
  }
};

// Health Insights & Reminders
exports.getHealthInsights = async (req, res) => {
  try {
    const { patientId } = req.params;
    if (!patientId) return res.status(400).json({ message: "Patient ID is required." });

    const prescriptions = await EPrescription.find({ patientId });
    if (!prescriptions.length) return res.status(404).json({ message: "No prescriptions found for this patient." });

    const insights = generateInsights(prescriptions);
    const reminders = generateReminders(prescriptions);

    res.status(200).json({ insights, reminders });
  } catch (error) {
    console.error("Error fetching health insights:", error);
    res.status(500).json({ message: "Server error while fetching health insights." });
  }
};

// Send Health Reminder Email
exports.sendHealthReminder = async (req, res) => {
  try {
    const {
      patientEmail,
      patientName,
      medications,
      nextDose,
      analysis,
      recommendations
    } = req.body;

    if (!patientEmail || !patientName || !Array.isArray(medications)) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const medList = medications.map((med, index) =>
      `${index + 1}. ${med.name} (${med.dosage}) – Qty: ${med.quantity} – ${med.instructions}`
    ).join('\n') || "No medications listed.";

    const formattedAnalysis = (analysis || []).map((a, i) => `${i + 1}. ${a}`).join('\n') || "No analysis available.";

    const mailOptions = {
      from: "rplearner01@gmail.com",
      to: patientEmail,
      subject: `⏰ Health Reminder & Personalized Recommendations`,
      text: `Dear ${patientName},\n\nThis is your personalized health update.\n\n💊 Medications:\n${medList}\n\n📈 Health Analysis:\n${formattedAnalysis}\n\n💡 Recommendations:\n${recommendations || "No recommendations at this time."}\n\n🕒 Next Dose: ${nextDose ? new Date(nextDose).toLocaleString() : "N/A"}\n\nStay well,\nYour Healthcare Team`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Health reminder with insights sent successfully." });
  } catch (error) {
    console.error("Error sending health reminder email:", error);
    res.status(500).json({ message: "Failed to send health reminder email.", error });
  }
};

// --- Utility functions ---
const generateInsights = (prescriptions) => {
  const medicationAnalysis = prescriptions.map(p => p.medications).flat();
  const uniqueMedications = [...new Set(medicationAnalysis)];

  const recommendations = [];

if (uniqueMedications.includes("Antihypertensive")) {
  recommendations.push("Monitor your blood pressure regularly.");
}
if (uniqueMedications.includes("Antidiabetic")) {
  recommendations.push("Maintain a balanced diet and check your blood sugar levels.");
}
if (uniqueMedications.includes("Antibiotic")) {
  recommendations.push("Complete the full course of antibiotics as prescribed.");
}
if (uniqueMedications.includes("Analgesic")) {
  recommendations.push("Use pain relievers only as needed and avoid overuse.");
}
if (uniqueMedications.includes("Antacid")) {
  recommendations.push("Avoid spicy and oily foods to manage gastric issues.");
}
if (uniqueMedications.includes("Antidepressant")) {
  recommendations.push("Attend therapy sessions regularly and take medication consistently.");
}
if (uniqueMedications.includes("Antiviral")) {
  recommendations.push("Get plenty of rest and avoid contact with others if contagious.");
}
if (uniqueMedications.includes("Bronchodilator")) {
  recommendations.push("Avoid allergens and use inhalers as prescribed.");
}
if (uniqueMedications.includes("Antifungal")) {
  recommendations.push("Keep affected areas clean and dry to prevent recurrence.");
}
if (uniqueMedications.includes("Steroid")) {
  recommendations.push("Do not abruptly stop taking steroids; taper as directed.");
}
if (uniqueMedications.includes("Insulin")) {
  recommendations.push("Monitor blood sugar daily and adhere to insulin schedule.");
}
if (uniqueMedications.includes("Antipsychotic")) {
  recommendations.push("Stay consistent with medication and consult regularly with your psychiatrist.");
}
if (uniqueMedications.includes("Diuretic")) {
  recommendations.push("Stay hydrated and monitor electrolyte levels regularly.");
}


  return {
    recommendations: recommendations.length > 0 ? recommendations.join(' ') : "No specific recommendations available.",
    medicationAnalysis: uniqueMedications,
  };
};

const generateReminders = (prescriptions) => {
  return prescriptions.map(p => ({
    medication: p.medications,
    nextDose: calculateNextDose(p),
  }));
};

const calculateNextDose = () => {
  const now = new Date();
  now.setHours(now.getHours() + 8);
  return now.toISOString();
};