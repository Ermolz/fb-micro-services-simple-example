const express = require('express');
const userController = require('../controllers/user.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', authenticateToken, userController.getAllUsers.bind(userController));
router.get('/:id', authenticateToken, userController.getUserById.bind(userController));
router.post('/', authenticateToken, userController.createUserProfile.bind(userController));
router.put('/:id', authenticateToken, userController.updateUserProfile.bind(userController));
router.delete('/:id', authenticateToken, userController.deleteUserProfile.bind(userController));

// Internal routes for Payment Service (no auth required)
router.get('/internal/:id', userController.getUserById.bind(userController));

module.exports = router;
