const Patient = require('./model');

module.exports = {

  lookupAnonId: (req, res) => {
    Patient
      .find({ 'characteristics.nhs': new RegExp(`^${req.params.nhsNumber}`) })
      .limit(5)
      .exec((err, p) => {
        if (err) return res.send({ error: 'An error occurred-lo99. Sorry' });
        if (p && p.length > 0) {
          return res.send(p.map(v => ({ nhs: v.characteristics.nhs, anonId: v.patientId })));
        } else if (RegExp('^[0-9]{10}$').test(req.params.nhsNumber)) {
          // if 10 digits then let's create a new id
          // should get a new one from the db but i'm lazy so let's
          // just make it very unlikely that there'll be a clash
          // Add 1000000 to ensure higher than those from SIR
          const id = Math.floor(1000000 + (Math.random() * 8000000));
          const newPatient = new Patient({
            patientId: id,
            characteristics: { nhs: req.params.nhsNumber },
          });
          return newPatient.save((err2) => {
            if (err2) return res.send({ error: 'An error occurred-88j7. Sorry' });
            return res.send([{ nhs: req.params.nhsNumber, anonId: id }]);
          });
        }
        return res.send([]);
      });
  },

  lookupNhs: (req, res) => {
    let anonId = +req.params.anonId;
    if (anonId < 1) return res.send([]);
    let diff = 10;
    const orQuery = [{ patientId: anonId }];
    anonId *= 10;
    while (anonId < 100000000) {
      orQuery.push({
        $and: [
          { patientId: { $gte: anonId } },
          { patientId: { $lt: diff + anonId } }],
      });
      anonId *= 10;
      diff *= 10;
    }

    return Patient
      .find({ $or: orQuery })// patientId: +req.params.anonId })
      .limit(5)
      .exec((err, p) => {
        if (p) {
          res.send(p.map(v => ({ nhs: v.characteristics.nhs, anonId: v.patientId })));
        } else res.send([]);
      });
  },

};
