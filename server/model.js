const mongoose = require('mongoose');

const { Schema } = mongoose;

const PatientSchema = new Schema({
  patientId: {
    type: Number,
    index: true,
  },
  characteristics: { nhs: String },
});

module.exports = mongoose.model('Patient', PatientSchema);
