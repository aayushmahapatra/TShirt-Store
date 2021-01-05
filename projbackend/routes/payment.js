var express = require('express');
var router = express.Router();
const {isSignedIn, isAuthenticated} = require('../controllers/auth');
const {getToken, processPayment} = require('../controllers/payment');

router.get('/payment/gettoken/:userId', isSignedIn, getToken);
router.post('/payment/braintree/:userId', isSignedIn, processPayment);

module.exports = router;
