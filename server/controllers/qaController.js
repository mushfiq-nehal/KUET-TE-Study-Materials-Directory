const Question = require('../models/Question');

const isValidImageDataUrl = (value) => {
  if (!value) return true;
  return /^data:image\/(png|jpe?g|webp|gif);base64,/.test(value);
};

exports.getQuestions = async (req, res) => {
  try {
    const { course } = req.query;
    const query = course ? { course } : {};
    const questions = await Question.find(query)
      .populate('askedBy', 'name roll')
      .populate('answers.answeredBy', 'name roll')
      .sort({ createdAt: -1 });
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
