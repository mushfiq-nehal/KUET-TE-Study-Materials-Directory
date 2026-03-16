import React, { useState } from 'react';
import { apiUrl } from '../services/api';

const CourseList = ({ courses }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [materialsByCourse, setMaterialsByCourse] = useState({});
  const [loadingCourseId, setLoadingCourseId] = useState(null);
  const [errorByCourse, setErrorByCourse] = useState({});

  const handleViewCourse = async (courseId) => {
    const course = courses.find((item) => item._id === courseId) || null;
    setSelectedCourse(course);

    if (materialsByCourse[courseId]) {
      return;
    }

    setLoadingCourseId(courseId);
    setErrorByCourse((prev) => ({ ...prev, [courseId]: '' }));

    try {
      const response = await fetch(apiUrl(`/api/materials?course=${courseId}`));
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load materials');
      }

      setMaterialsByCourse((prev) => ({ ...prev, [courseId]: data }));
    } catch (err) {
      setErrorByCourse((prev) => ({ ...prev, [courseId]: err.message }));
    } finally {
      setLoadingCourseId(null);
    }
  };

  const closeModal = () => {
    setSelectedCourse(null);
  };

  const groupedMaterials = selectedCourse
    ? (materialsByCourse[selectedCourse._id] || []).reduce((acc, material) => {
        const instructor = material.instructor || 'General';
        if (!acc[instructor]) {
          acc[instructor] = [];
        }
        acc[instructor].push(material);
        return acc;
      }, {})
    : {};

  return (
    <>
      <div className="courses-container">
        {courses.length === 0 ? (
          <p className="no-courses">No courses found</p>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <div key={course._id} className="course-card">
                <h3>{course.name}</h3>
                <p className="course-code">{course.code}</p>
                <div className="course-details">
                  {course.credits && <span>Credits: {course.credits}</span>}
                  {course.instructor && <span>Instructor: {course.instructor}</span>}
                </div>
                <button className="view-course-btn" onClick={() => handleViewCourse(course._id)}>
                  View Course
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedCourse && (
        <div className="course-modal-overlay" onClick={closeModal}>
          <div className="course-modal" onClick={(e) => e.stopPropagation()}>
            <div className="course-modal-header">
              <h3>{selectedCourse.code} - {selectedCourse.name}</h3>
              <button className="course-modal-close" onClick={closeModal}>X</button>
            </div>

            {loadingCourseId === selectedCourse._id && <p>Loading materials...</p>}

            {errorByCourse[selectedCourse._id] && (
              <p className="course-materials-error">{errorByCourse[selectedCourse._id]}</p>
            )}

            {loadingCourseId !== selectedCourse._id && !errorByCourse[selectedCourse._id] && (
              <>
                {(materialsByCourse[selectedCourse._id] || []).length === 0 ? (
                  <p>No materials added yet.</p>
                ) : (
                  <div className="course-material-groups">
                    {Object.keys(groupedMaterials).map((instructor) => (
                      <div key={instructor} className="course-material-group">
                        <h4>{instructor}</h4>
                        <ul className="course-material-list">
                          {groupedMaterials[instructor].map((material) => (
                            <li key={material._id}>
                              <a href={material.googleDriveLink} target="_blank" rel="noreferrer">
                                {material.title}
                              </a>
                              <span>{material.type}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CourseList;
