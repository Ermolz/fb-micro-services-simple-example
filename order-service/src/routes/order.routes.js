const express = require('express');
const orderController = require('../controllers/order.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', authenticateToken, orderController.getUserOrders.bind(orderController));
router.get('/:id', authenticateToken, orderController.getOrderById.bind(orderController));
router.post('/', authenticateToken, orderController.createOrder.bind(orderController));
router.delete('/:id', authenticateToken, orderController.deleteOrder.bind(orderController));

// Internal routes for Payment Service (no auth required)
router.get('/internal/:id', orderController.getOrderByIdInternal.bind(orderController));

module.exports = router;
