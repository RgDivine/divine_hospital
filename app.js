const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const mongoose =require(mongoose);
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:3000/Divinerg', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Mongoose Schema
const patientSchema = new mongoose.Schema({
  patient_id: Number,
  surname: String,
  other_names: String,
  gender: String,
  phone_number: String,
  residential_address: String,
  emergency_contact: {
    name: String,
    contact: String,
    relationship: String,
  },
  encounters: [{
    date_time: Date,
    encounter_type: String,
  }],
  vitals: {
    blood_pressure: String,
    temperature: Number,
    pulse: Number,
    spo2: Number,
  },
});

const Patient = mongoose.model('Patient', patientSchema);

// Endpoint to register a patient
app.post('/api/patients/register', async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.json({ status: 'success', message: 'Patient registered successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

// Endpoint to start an encounter
app.post('/api/patients/start-encounter', async (req, res) => {
    try {
      const { patient_id, date_time, encounter_type } = req.body;
      const patient = await Patient.findOne({ patient_id });
      if (!patient) {
        return res.status(404).json({ status: 'error', message: 'Patient not found' });
      }
      patient.encounters.push({ date_time, encounter_type });
      await patient.save();
      res.json({ status: 'success', message: 'Encounter started successfully' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  });
  
  // Endpoint to submit vitals by nurse
  app.post('/api/nurse/submit-vitals', async (req, res) => {
    try {
      const { patient_id, blood_pressure, temperature, pulse, spo2 } = req.body;
      const patient = await Patient.findOne({ patient_id });
      if (!patient) {
        return res.status(404).json({ status: 'error', message: 'Patient not found' });
      }
      patient.vitals = { blood_pressure, temperature, pulse, spo2 };
      await patient.save();
      res.json({ status: 'success', message: 'Vitals submitted successfully' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  });
  
  // Endpoint to view list of patients by doctor
  app.get('/api/doctor/patients', async (req, res) => {
    try {
      const patients = await Patient.find({}, { _id: 0, __v: 0 });
      res.json({ patients });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  });
  
  // Endpoint to view details of a specific patient by doctor
  app.get('/api/doctor/patient/:patient_id', async (req, res) => {
    try {
      const { patient_id } = req.params;
      const patient = await Patient.findOne({ patient_id }, { _id: 0, __v: 0 });
      if (!patient) {
        return res.status(404).json({ status: 'error', message: 'Patient not found' });
      }
      res.json(patient);
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  });
  
  app.listen(port, () => {
    console.log(`Server is running on port 102.176.94.239/32`);
  });
  mongoose.connect(mongodb+srv://Divinerg:divineismyname@divinerg.snfm4ny.mongodb.net/divine?retryWrites=true&w=majority)
  .then(() => {
    console.log('connect to mondb')
  }).catch(() => {
    console.log(error)
  })