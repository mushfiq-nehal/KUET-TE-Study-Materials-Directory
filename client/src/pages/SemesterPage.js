import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/Semester.css';
import CourseList from '../components/CourseList';
import { apiUrl } from '../services/api';

const SemesterPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [courses, setCourses] = useState([]);
  const [activeSection, setActiveSection] = useState('THEORY');
  const [semesterLabel, setSemesterLabel] = useState('');

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate('/');
  };

  useEffect(() => {
    // Fetch courses for this semester
    fetch(apiUrl(`/api/courses?semester=${id}&section=${activeSection}`))
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error('Error fetching courses:', err));
  }, [id, activeSection]);

  useEffect(() => {
    fetch(apiUrl('/api/semesters'))
      .then((res) => res.json())
      .then((data) => {
        const matched = data.find((semester) => semester._id === id);
        setSemesterLabel(matched?.level || id);
      })
      .catch(() => setSemesterLabel(id));
  }, [id]);

  return (
    <div className="semester-container">
      <header className="semester-header">
        <button
          className="semester-back-btn"
          onClick={handleBack}
          type="button"
          aria-label="Go back"
          title="Go back"
        >
          <i className="bi bi-arrow-left" aria-hidden="true"></i>
        </button>
        <h1>Semester {semesterLabel || id}</h1>
        <p>Select a section to view courses</p>
      </header>

      <div className="section-tabs">
        {['THEORY', 'SESSIONALS', 'QUESTION_BANK'].map((section) => (
          <button
            key={section}
            className={`section-tab ${activeSection === section ? 'active' : ''}`}
            onClick={() => setActiveSection(section)}
          >
            {section.replace('_', ' ')}
          </button>
        ))}
      </div>

      <CourseList courses={courses} />
    </div>
  );
};

export default SemesterPage;
