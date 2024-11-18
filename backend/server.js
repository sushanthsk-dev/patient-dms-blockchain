const express = require('express');
const cors = require('cors');
require('dotenv').config();
const moongose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10kb' })); //we can limit the amt of data that comes in the body
app.use(express.urlencoded({ extended: true, limit: '10kb' })); 

// Import routes
const patientRoutes = require('./src/routes/patientRoutes');
const doctorRoutes = require('./src/routes/doctorRoutes');
const medicalRecordRoutes = require('./src/routes/medicalRecordRoutes');
const userRoutes = require('./src/routes/userRoutes');

// Use routes
app.use('/api/patient', patientRoutes);
app.use('/api/user', userRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/medical-record', medicalRecordRoutes);

const PORT = process.env.PORT || 3001;

const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
  );
  
  moongose
    .connect(DB, {   
      useNewUrlParser: true,
    })
    .then(() => {
      console.log('DATABASE connected successfully');
    })
    .catch((e) => console.log(e));
  const port = process.env.PORT || 3001;
  
  const server = app.listen(port, () => {
    console.log(`Listening on ${port}...`);
  });
