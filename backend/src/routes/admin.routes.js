const router = require('express').Router();
const { getStats, getAllUsers, toggleUser } = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/stats', authenticate, authorize('ADMIN'), getStats);
router.get('/users', authenticate, authorize('ADMIN'), getAllUsers);
router.patch('/users/:id/toggle', authenticate, authorize('ADMIN'), toggleUser);

module.exports = router;
