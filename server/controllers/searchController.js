const Course = require('../models/Course');
const Material = require('../models/Material');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

exports.globalSearch = async (req, res) => {
  try {
    const { q = '', semester = '', section = '' } = req.query;
    const searchTerm = q.trim();

    const courseFilter = {};
    if (semester) courseFilter.semester = semester;
    if (section) courseFilter.section = section;

    const materialFilter = {};

    if (searchTerm) {
      const regex = new RegExp(escapeRegex(searchTerm), 'i');
      courseFilter.$or = [
        { name: regex },
        { code: regex },
        { instructor: regex },
      ];
      materialFilter.$or = [
        { title: regex },
        { description: regex },
        { type: regex },
        { instructor: regex },
      ];
    }

    let filteredCourseIds = null;
    if (semester || section) {
      const matchingCourses = await Course.find({
        ...(semester ? { semester } : {}),
        ...(section ? { section } : {}),
      }).select('_id');

      filteredCourseIds = matchingCourses.map((course) => course._id);
      materialFilter.course = { $in: filteredCourseIds };
    }

    const [courses, materials] = await Promise.all([
      Course.find(courseFilter)
        .populate('semester', 'level name')
        .sort({ createdAt: -1 })
        .limit(100),
      filteredCourseIds && filteredCourseIds.length === 0
        ? []
        : Material.find(materialFilter)
            .populate({
              path: 'course',
              select: 'name code section semester',
              populate: { path: 'semester', select: 'level name' },
            })
            .sort({ createdAt: -1 })
            .limit(100),
    ]);

    res.json({
      courses,
      materials,
      total: courses.length + materials.length,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
