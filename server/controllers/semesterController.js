const Semester = require('../models/Semester');

exports.getSemesters = async (req, res) => {
  try {
    const order = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2'];
    const semesters = await Semester.find();

    semesters.sort((a, b) => order.indexOf(a.level) - order.indexOf(b.level));
    res.json(semesters);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addSemester = async (req, res) => {
  try {
    const { level, description } = req.body;

    if (!level) {
      return res.status(400).json({ message: 'Semester level is required' });
    }

    const existing = await Semester.findOne({ level });

    if (existing) {
      return res.status(400).json({ message: 'Semester already exists' });
    }

    const semester = new Semester({
      name: level,
      level,
      description,
    });

    await semester.save();
    res.status(201).json(semester);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
