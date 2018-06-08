const Patient = require('./model');

module.exports = {

  lookupAnonId: (req, res) => {
    Patient
      .find({ 'characteristics.nhs': new RegExp(`^${req.params.nhsNumber}`) })
      .limit(5)
      .exec((err, p) => {
        if (p) {
          res.send(p.map(v => ({ nhs: v.characteristics.nhs, anonId: v.patientId })));
        } else res.send([]);
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

    console.log(JSON.stringify(orQuery, null, 2));

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
