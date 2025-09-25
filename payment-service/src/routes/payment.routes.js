const express = require('express');
const paymentController = require('../controllers/payment.controller');

const router = express.Router();

router.post('/', paymentController.createPayment.bind(paymentController));
router.get('/:id', paymentController.getPaymentById.bind(paymentController));
router.get('/user/:userId', paymentController.getPaymentsByUserId.bind(paymentController));
router.put('/:id/status', paymentController.updatePaymentStatus.bind(paymentController));

module.exports = router;
