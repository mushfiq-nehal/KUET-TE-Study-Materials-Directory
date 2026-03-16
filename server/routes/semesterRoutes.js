const express = require('express');
const router = express.Router();
const semesterController = require('../controllers/semesterController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', semesterController.getSemesters);
router.post('/', authMiddleware, adminMiddleware, semesterController.addSemester);

module.exports = router;
