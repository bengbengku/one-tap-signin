const express = require('express');
const router = express.Router();
const { register, login, userProvider, me } = require('../controllers/user');

const { authUser } = require('../middleware/auth');

router.post('/login', login);
router.post('/register', register);
router.post('/me', authUser, me);
router.post('/google-login', userProvider);

module.exports = router;
