const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', courseController.getCourses);
router.post('/', authMiddleware, adminMiddleware, courseController.addCourse);
router.put('/:id', authMiddleware, adminMiddleware, courseController.updateCourse);
router.delete('/:id', authMiddleware, adminMiddleware, courseController.deleteCourse);
router.get('/chapters', courseController.getChapters);
router.post('/chapters', authMiddleware, adminMiddleware, courseController.addChapter);

module.exports = router;
