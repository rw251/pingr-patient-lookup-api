const Patient = require('./model');

module.exports = {

  lookupAnonId: async (req, res) => {
    try {
      const p = await Patient.findOne({ 'characteristics.nhs': req.params.nhsNumber }).lean().exec();
      if (p) res.send({ nhs: +req.params.nhsNumber, anonId: p.patientId });
      else res.send({ errorMsg: 'No patient found' });
    } catch (e) {
      res.send({ errorMsg: 'An error occurred.' });
    }
  },

  lookupNhs: async (req, res) => {
    try {
      const p = await Patient.findOne({ patientId: +req.params.anonId }).lean().exec();
      if (p) res.send({ nhs: p.characteristics.nhs, anonId: +req.params.anonId });
      else res.send({ errorMsg: 'No patient found' });
    } catch (e) {
      res.send({ errorMsg: 'An error occurred.' });
    }
  },

};
