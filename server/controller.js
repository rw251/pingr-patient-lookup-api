const Patient = require('./model');

module.exports = {

  lookupAnonId: (req, res) => {
    Patient.findOne({ 'characteristics.nhs': req.params.nhsNumber }, (err, p) => {
      if (p) res.send({ nhs: +req.params.nhsNumber, anonId: p.patientId });
      else res.send({ errorMsg: 'No patient found' });
    });
  },

  lookupNhs: (req, res) => {
    Patient.findOne({ patientId: +req.params.anonId }, (err, p) => {
      if (p) res.send({ nhs: p.characteristics.nhs, anonId: +req.params.anonId });
      else res.send({ errorMsg: 'No patient found' });
    });
  },

};
