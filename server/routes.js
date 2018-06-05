const express = require('express');

const ctrl = require('./controller');

const router = express.Router();

router.get('/nhs/:nhsNumber', ctrl.lookupAnonId);
router.get('/anonId/:anonId', ctrl.lookupNhs);

router.get('*', (req, res) => {
  res.send('OK');
});

module.exports = router;
