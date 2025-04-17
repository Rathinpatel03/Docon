const express = require('express');
const router = express.Router();
const healthreminderController = require('../controllers/HealthReminderController');

router.get('/recommendations/:userId', healthreminderController.getRecommendations);

router.post('/reminders', healthreminderController.setMedicationReminder);

router.get('/reminders/:userId', healthreminderController.getMedicationReminders);

router.get('/analytics/:userId', healthreminderController.getPredictiveAnalytics);

router.post('/send-email', healthreminderController.sendEmail);

module.exports = router;