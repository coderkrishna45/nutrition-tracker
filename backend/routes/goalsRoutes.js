const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/authMiddleware');
const controller = require('../controllers/goalsController');

router.get('/',verifyToken,controller.display_goals);
router.put('/',verifyToken,controller.change_goals);

module.exports = router