const Material = require('../models/Material');

exports.getMaterials = async (req, res) => {
  try {
    const { chapter, course } = req.query;
    const query = {};
    if (chapter) query.chapter = chapter;
    if (course) query.course = course;

    const materials = await Material.find(query)
      .populate('course')
      .populate('chapter')
      .populate('uploadedBy', 'name roll');
    res.json(materials);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addMaterial = async (req, res) => {
  try {
    const { title, description, course, chapter, googleDriveLink, type, instructor } = req.body;

    if (!course) {
      return res.status(400).json({ message: 'Course is required' });
    }

    const material = new Material({
      title,
      description,
      course,
      chapter,
      googleDriveLink,
      type,
      instructor: instructor || 'General',
      uploadedBy: req.user.userId,
    });

    await material.save();
    res.status(201).json(material);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteMaterial = async (req, res) => {
  try {
    await Material.findByIdAndDelete(req.params.id);
    res.json({ message: 'Material deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateMaterial = async (req, res) => {
  try {
    const { title, description, course, chapter, googleDriveLink, type, instructor } = req.body;

    const updated = await Material.findByIdAndUpdate(
      req.params.id,
      { title, description, course, chapter, googleDriveLink, type, instructor: instructor || 'General' },
      { new: true, runValidators: true }
    )
      .populate('course')
      .populate('chapter')
      .populate('uploadedBy', 'name roll');

    if (!updated) {
      return res.status(404).json({ message: 'Material not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
