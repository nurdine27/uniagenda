const router = require('express').Router();
const { getDocentes, getDocenteById, updateProfile } = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/docentes', authenticate, getDocentes);
router.get('/docentes/:id', authenticate, getDocenteById);
router.put('/profile', authenticate, updateProfile);

module.exports = router;
