const router = require('express').Router();
const { getDisponibilidades, createDisponibilidade, deleteDisponibilidade } = require('../controllers/disponibilidade.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/:docenteId', authenticate, getDisponibilidades);
router.post('/', authenticate, authorize('DOCENTE'), createDisponibilidade);
router.delete('/:id', authenticate, authorize('DOCENTE'), deleteDisponibilidade);

module.exports = router;
