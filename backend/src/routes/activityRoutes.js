'use strict';
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const activityController = require('../controllers/activityController');

router.post('/log', auth, activityController.logActivity);
router.get('/my', auth, activityController.getMyActivity);
router.get('/summary', auth, activityController.getActivitySummary);

module.exports = router;