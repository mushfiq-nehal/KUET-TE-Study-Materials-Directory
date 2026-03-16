const express = require('express');
const router = express.Router();
const qaController = require('../controllers/qaController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', qaController.getQuestions);
router.post('/', authMiddleware, qaController.askQuestion);
router.post('/:id/answer', authMiddleware, qaController.answerQuestion);
router.delete('/:id', authMiddleware, qaController.deleteQuestion);
router.delete('/:questionId/answer/:answerId', authMiddleware, qaController.deleteAnswer);

module.exports = router;
