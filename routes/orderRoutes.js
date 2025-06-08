const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');

// Protected routes
router.use(authenticate);

router.post('/', orderController.createOrder);
router.get('/', orderController.getUserOrders);
router.get('/:id', orderController.getOrderDetails);

// Admin-only routes
const { authorize } = require('../middleware/auth');
router.use(authorize('admin'));

router.get('/all', orderController.getAllOrders);
router.put('/:id/status', orderController.updateOrderStatus);

module.exports = router;