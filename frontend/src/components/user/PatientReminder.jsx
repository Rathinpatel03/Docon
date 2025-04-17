import React, { useEffect, useState } from 'react';
import { Typography, Card, CardContent, Switch,FormControlLabel, Divider, Box } from '@mui/material';
import axios from 'axios';

const PatientReminder = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emailRemindersEnabled, setEmailRemindersEnabled] = useState(true);

  const patientId = localStorage.getItem("id");

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await axios.get(`/eprescription/health-insights/${patientId}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching health insights:", error);
        setError("Failed to fetch insights.");
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [patientId]);

  const handleToggle = async (event) => {
    const newState = event.target.checked;
    setEmailRemindersEnabled(newState);

    try {
      await axios.post(`/eprescription/email-reminder-toggle`, {
        patientId,
        enabled: newState
      });
    } catch (err) {
      console.error("Failed to update email preference:", err);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return <Typography>No data available.</Typography>;

  const { insights, reminders } = data;

  return (
    <Box
      sx={{
        maxWidth: 800,
        margin: 'auto',
        marginTop: 4,
        backgroundColor: '#f4f6f9',
        padding: 3,
        borderRadius: 2,
        boxShadow: 3
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#343a40' }}>
        🩺 Health Insights Dashboard
      </Typography>

      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ color: '#007bff' }}>Email Reminders</Typography>
            <FormControlLabel
              control={<Switch checked={emailRemindersEnabled} onChange={handleToggle} color="primary" />}
              label={emailRemindersEnabled ? "ON" : "OFF"}
            />
          </Box>
        </CardContent>
      </Card>


      <Card sx={{ boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: '#ffc107', marginBottom: 1 }}>⏰ Medication Reminders</Typography>
          {Array.isArray(reminders) && reminders.length > 0 ? (
            reminders.map((reminder, index) => (
              <Box key={index} sx={{ mb: 2, pl: 1, borderLeft: '4px solid #ffc107' }}>
                {Array.isArray(reminder.medication) ? (
                  reminder.medication.map((med, i) => (
                    <Typography key={i} variant="body2">
                    {`Take ${med?.name || "medicine"} (${med?.dosage || "dose"}), ${med?.quantity || 0} time(s). Instructions: ${med?.instructions || "none"}`}
                  </Typography>
                  
                  ))
                ) : (
                  <Typography variant="body2">No medication data available.</Typography>
                )}
                <Typography variant="caption" color="textSecondary">
                  Next Dose: {reminder?.nextDose ? new Date(reminder.nextDose).toLocaleString() : "N/A"}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2">No reminders available.</Typography>
          )}
        </CardContent>
      </Card>
      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: '#28a745', marginBottom: 1 }}>💡 Recommendations</Typography>
          <Typography variant="body1" paragraph>
            {insights?.recommendations || "No recommendations available."}
          </Typography>

          <Divider sx={{ my: 2 }} />

        </CardContent>
      </Card>
    </Box>
  );
};

export default PatientReminder;