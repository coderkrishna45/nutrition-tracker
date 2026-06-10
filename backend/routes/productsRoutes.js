const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/authMiddleware');
const controller = require('../controllers/productsController');

router.post('/scan',verifyToken,controller.scanLable);

module.exports = router;