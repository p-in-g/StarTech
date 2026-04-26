const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const premiumController = require('../controllers/premiumController');

router.post('/quote', auth, premiumController.getPremiumQuote);
router.get('/my', auth, premiumController.getMyPremiums);

module.exports = router;