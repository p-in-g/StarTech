'use strict';
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const disruptionController = require('../controllers/disruptionController');

router.post('/check', auth, disruptionController.checkDisruption);
router.get('/active', auth, disruptionController.getActiveDisruptions);

module.exports = router;