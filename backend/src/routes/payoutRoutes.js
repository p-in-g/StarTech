'use strict';
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const payoutController = require('../controllers/payoutController');

router.post('/trigger', auth, payoutController.triggerPayout);
router.get('/my', auth, payoutController.getMyPayouts);

module.exports = router;