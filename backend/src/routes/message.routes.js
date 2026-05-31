const router = require('express').Router();
const { sendMessage, getMessages } = require('../controllers/message.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/:meetingId', authenticate, sendMessage);
router.get('/:meetingId', authenticate, getMessages);

module.exports = router;
