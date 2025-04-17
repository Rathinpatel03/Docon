const express = require('express');
const router = express.Router();
const ePrescriptionController = require('../controllers/EPrescriptionsController');

router.post('/prescriptions', ePrescriptionController.createPrescription);
router.get('/allprescriptions', ePrescriptionController.getAllPrescriptions);
router.get('/prescriptions/:id', ePrescriptionController.getPrescriptionById);
router.delete('/prescriptions/:id', ePrescriptionController.deletePrescription);
router.get('/patient/:patientId', ePrescriptionController.getPrescriptionsByPatientId);
router.get('/doctor/:doctorId', ePrescriptionController.getPrescriptionsByDoctorId);
router.get('/health-insights/:patientId', ePrescriptionController.getHealthInsights);

module.exports = router;