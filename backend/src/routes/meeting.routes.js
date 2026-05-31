const router = require('express').Router();
const { createMeeting, getMyMeetings, getMeetingById, updateMeetingStatus, cancelMeeting, avaliarMeeting } = require('../controllers/meeting.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.post('/', authenticate, authorize('ESTUDANTE'), createMeeting);
router.get('/', authenticate, getMyMeetings);
router.get('/:id', authenticate, getMeetingById);
router.patch('/:id/status', authenticate, authorize('DOCENTE'), updateMeetingStatus);
router.patch('/:id/cancel', authenticate, cancelMeeting);
router.post('/:id/avaliacao', authenticate, avaliarMeeting);

module.exports = router;
