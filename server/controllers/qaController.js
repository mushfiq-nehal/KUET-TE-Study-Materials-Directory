const Question = require('../models/Question');

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

const isValidImageDataUrl = (value) => {
  if (!value) return true;
  return /^data:image\/(png|jpe?g|webp|gif);base64,/.test(value);
};

const getDataUrlByteSize = (value) => {
  if (!value) return 0;
  const parts = value.split(',');
  if (parts.length !== 2) return 0;

  const base64 = parts[1];
  const padding = (base64.match(/=+$/) || [''])[0].length;
  return Math.floor((base64.length * 3) / 4) - padding;
};

const isOwnerOrAdmin = (reqUser, ownerId) => {
  if (!reqUser) return false;
  return reqUser.isAdmin || (ownerId && ownerId.toString() === reqUser.userId);
};

exports.getQuestions = async (req, res) => {
  try {
    const { course } = req.query;
    const query = course ? { course } : {};
    const questions = await Question.find(query)
      .populate('askedBy', 'name roll')
      .populate('answers.answeredBy', 'name roll')
      .sort({ createdAt: -1, _id: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.askQuestion = async (req, res) => {
  try {
    const { title, content, course, image } = req.body;

    if (!isValidImageDataUrl(image)) {
      return res.status(400).json({ message: 'Invalid image format' });
    }

    if (getDataUrlByteSize(image) > MAX_IMAGE_SIZE_BYTES) {
      return res.status(413).json({ message: 'Question image must be smaller than 2MB' });
    }

    const question = new Question({
      title,
      content,
      image: image || '',
      course,
      askedBy: req.user.userId,
    });

    await question.save();
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.answerQuestion = async (req, res) => {
  try {
    const { content, image } = req.body;

    if (!isValidImageDataUrl(image)) {
      return res.status(400).json({ message: 'Invalid image format' });
    }

    if (getDataUrlByteSize(image) > MAX_IMAGE_SIZE_BYTES) {
      return res.status(413).json({ message: 'Answer image must be smaller than 2MB' });
    }

    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    question.answers.push({
      content,
      image: image || '',
      answeredBy: req.user.userId,
    });

    await question.save();
    const populated = await Question.findById(question._id)
      .populate('askedBy', 'name roll')
      .populate('answers.answeredBy', 'name roll');

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (!isOwnerOrAdmin(req.user, question.askedBy)) {
      return res.status(403).json({ message: 'You are not allowed to delete this question' });
    }

    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteAnswer = async (req, res) => {
  try {
    const { questionId, answerId } = req.params;
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const answer = question.answers.id(answerId);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    const canDelete =
      req.user.isAdmin ||
      (answer.answeredBy && answer.answeredBy.toString() === req.user.userId) ||
      (question.askedBy && question.askedBy.toString() === req.user.userId);

    if (!canDelete) {
      return res.status(403).json({ message: 'You are not allowed to delete this answer' });
    }

    question.answers.pull(answerId);
    await question.save();

    const populated = await Question.findById(question._id)
      .populate('askedBy', 'name roll')
      .populate('answers.answeredBy', 'name roll');

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
