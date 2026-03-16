const Course = require('../models/Course');
const Chapter = require('../models/Chapter');
const Material = require('../models/Material');

exports.getCourses = async (req, res) => {
  try {
    const { semester, section } = req.query;
    const query = {};
    if (semester) query.semester = semester;
    if (section) query.section = section;

    const courses = await Course.find(query).populate('semester');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addCourse = async (req, res) => {
  try {
    const { name, code, semester, section, credits, instructor } = req.body;

    const course = new Course({
      name,
      code,
      semester,
      section,
      credits,
      instructor,
    });

    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getChapters = async (req, res) => {
  try {
    const { course } = req.query;
    const chapters = await Chapter.find({ course }).populate('course');
    res.json(chapters);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addChapter = async (req, res) => {
  try {
    const { title, number, course, description } = req.body;

    const chapter = new Chapter({
      title,
      number,
      course,
      description,
    });

    await chapter.save();
    res.status(201).json(chapter);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { name, code, semester, section, credits, instructor } = req.body;

    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      { name, code, semester, section, credits, instructor },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const chapters = await Chapter.find({ course: req.params.id }).select('_id');
    const chapterIds = chapters.map((c) => c._id);

    if (chapterIds.length > 0) {
      await Material.deleteMany({
        $or: [{ chapter: { $in: chapterIds } }, { course: req.params.id }],
      });
      await Chapter.deleteMany({ course: req.params.id });
    } else {
      await Material.deleteMany({ course: req.params.id });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
