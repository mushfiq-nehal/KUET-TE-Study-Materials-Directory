import React, { useState, useEffect, useCallback } from 'react';
import '../styles/AdminDashboard.css';
import { apiUrl } from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('semesters');
  const [semesters, setSemesters] = useState([]);
  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [semesterForm, setSemesterForm] = useState({ level: '' });

  const [courseForm, setCourseForm] = useState({
    name: '',
    code: '',
    semester: '',
    section: 'THEORY',
    credits: '',
    instructor: '',
  });

  const [materialForm, setMaterialForm] = useState({
    title: '',
    instructor: '',
    description: '',
    course: '',
    googleDriveLink: '',
    type: 'PDF',
  });

  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    type: 'INFO',
  });

  const getAuthHeaders = (withJson = true) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    if (withJson) headers['Content-Type'] = 'application/json';
    return headers;
  };

  const handleApiResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }
    return data;
  };

  const loadSemesters = useCallback(async () => {
    const response = await fetch(apiUrl('/api/semesters'));
    const data = await handleApiResponse(response);
    setSemesters(data);
  }, []);

  const loadCourses = useCallback(async () => {
    const response = await fetch(apiUrl('/api/courses'));
    const data = await handleApiResponse(response);
    setCourses(data);
  }, []);

  const loadMaterials = useCallback(async () => {
    const response = await fetch(apiUrl('/api/materials'));
    const data = await handleApiResponse(response);
    setMaterials(data);
  }, []);

  const clearMessages = () => {
    setSuccess('');
    setError('');
  };

  useEffect(() => {
    const bootstrapAdminData = async () => {
      try {
        await Promise.all([loadSemesters(), loadCourses()]);
        await loadMaterials();
      } catch (err) {
        setError(err.message);
      }
    };

    bootstrapAdminData();
  }, [loadCourses, loadMaterials, loadSemesters]);

  const handleAddSemester = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      const response = await fetch(apiUrl('/api/semesters'), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(semesterForm),
      });

      const created = await handleApiResponse(response);
      setSemesters((prev) => [...prev, created]);
      setSemesterForm({ level: '' });
      setSuccess('Semester created successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      const payload = {
        ...courseForm,
        credits: courseForm.credits ? Number(courseForm.credits) : undefined,
      };

      const response = await fetch(apiUrl('/api/courses'), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const created = await handleApiResponse(response);
      setCourses((prev) => [...prev, created]);
      setCourseForm({
        name: '',
        code: '',
        semester: '',
        section: 'THEORY',
        credits: '',
        instructor: '',
      });
      setSuccess('Course added successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      const response = await fetch(apiUrl('/api/materials'), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: materialForm.title,
          instructor: materialForm.instructor,
          description: materialForm.description,
          course: materialForm.course,
          googleDriveLink: materialForm.googleDriveLink,
          type: materialForm.type,
        }),
      });

      const created = await handleApiResponse(response);
      setMaterialForm({
        title: '',
        instructor: '',
        description: '',
        course: '',
        googleDriveLink: '',
        type: 'PDF',
      });
      setMaterials((prev) => [created, ...prev]);
      setSuccess('Material added successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotification = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      const response = await fetch(apiUrl('/api/notifications'), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(notificationForm),
      });

      await handleApiResponse(response);
      setNotificationForm({
        title: '',
        message: '',
        type: 'INFO',
      });
      setSuccess('Notification published successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Delete this course and all its chapters/materials?')) return;
    clearMessages();

    try {
      const response = await fetch(apiUrl(`/api/courses/${courseId}`), {
        method: 'DELETE',
        headers: getAuthHeaders(false),
      });
      await handleApiResponse(response);
      setCourses((prev) => prev.filter((course) => course._id !== courseId));
      setMaterials((prev) =>
        prev.filter((material) => material.chapter?.course !== courseId && material.chapter?.course?._id !== courseId)
      );
      setSuccess('Course deleted successfully');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateCourse = async (course) => {
    const name = window.prompt('Course name', course.name);
    if (!name) return;
    const code = window.prompt('Course code', course.code);
    if (!code) return;
    const section = window.prompt('Section (THEORY/SESSIONALS/QUESTION_BANK)', course.section);
    if (!section) return;
    const creditsInput = window.prompt('Credits (optional)', course.credits ?? '');
    const instructor = window.prompt('Instructor (optional)', course.instructor ?? '');

    clearMessages();
    try {
      const response = await fetch(apiUrl(`/api/courses/${course._id}`), {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name,
          code,
          section,
          semester: course.semester?._id || course.semester,
          credits: creditsInput ? Number(creditsInput) : undefined,
          instructor,
        }),
      });
      const updated = await handleApiResponse(response);
      setCourses((prev) => prev.map((c) => (c._id === updated._id ? { ...c, ...updated } : c)));
      setSuccess('Course updated successfully');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    if (!window.confirm('Delete this material?')) return;
    clearMessages();

    try {
      const response = await fetch(apiUrl(`/api/materials/${materialId}`), {
        method: 'DELETE',
        headers: getAuthHeaders(false),
      });
      await handleApiResponse(response);
      setMaterials((prev) => prev.filter((material) => material._id !== materialId));
      setSuccess('Material deleted successfully');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateMaterial = async (material) => {
    const title = window.prompt('Material title', material.title);
    if (!title) return;
    const type = window.prompt('Type (PDF/DOC/SPREADSHEET/VIDEO/FOLDER)', material.type);
    if (!type) return;
    const instructor = window.prompt('Instructor', material.instructor || 'General');
    if (!instructor) return;
    const googleDriveLink = window.prompt('Google Drive Link', material.googleDriveLink);
    if (!googleDriveLink) return;
    const description = window.prompt('Description (optional)', material.description || '') || '';

    clearMessages();
    try {
      const response = await fetch(apiUrl(`/api/materials/${material._id}`), {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title,
          type,
          instructor,
          googleDriveLink,
          description,
          course: material.course?._id || material.course,
          chapter: material.chapter?._id || material.chapter,
        }),
      });
      const updated = await handleApiResponse(response);
      setMaterials((prev) => prev.map((m) => (m._id === updated._id ? updated : m)));
      setSuccess('Material updated successfully');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {success && <p className="admin-message success">{success}</p>}
      {error && <p className="admin-message error">{error}</p>}

      <div className="admin-tabs">
        <button
          className={`tab ${activeTab === 'semesters' ? 'active' : ''}`}
          onClick={() => setActiveTab('semesters')}
        >
          Semesters
        </button>
        <button
          className={`tab ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
        >
          Courses
        </button>
        <button
          className={`tab ${activeTab === 'materials' ? 'active' : ''}`}
          onClick={() => setActiveTab('materials')}
        >
          Materials
        </button>
        <button
          className={`tab ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'semesters' && (
          <div>
            <h2>Manage Semesters</h2>
            <form onSubmit={handleAddSemester}>
              <select
                value={semesterForm.level}
                onChange={(e) => setSemesterForm({ ...semesterForm, level: e.target.value })}
                required
              >
                <option value="">Select Semester (Type)</option>
                <option value="1-1">1-1</option>
                <option value="1-2">1-2</option>
                <option value="2-1">2-1</option>
                <option value="2-2">2-2</option>
                <option value="3-1">3-1</option>
                <option value="3-2">3-2</option>
                <option value="4-1">4-1</option>
                <option value="4-2">4-2</option>
              </select>
              <button type="submit" disabled={loading}>Add Semester</button>
            </form>

            <div className="admin-list">
              {semesters.map((semester) => (
                <div key={semester._id} className="admin-list-item">
                  <strong>{semester.level}</strong>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div>
            <h2>Add Course</h2>
            <form onSubmit={handleAddCourse}>
              <input
                type="text"
                placeholder="Course name"
                value={courseForm.name}
                onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Course code"
                value={courseForm.code}
                onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                required
              />
              <select
                value={courseForm.semester}
                onChange={(e) => setCourseForm({ ...courseForm, semester: e.target.value })}
                required
              >
                <option value="">Select Semester</option>
                {semesters.map((semester) => (
                  <option key={semester._id} value={semester._id}>
                    {semester.level} - {semester.name}
                  </option>
                ))}
              </select>
              <select
                value={courseForm.section}
                onChange={(e) => setCourseForm({ ...courseForm, section: e.target.value })}
                required
              >
                <option value="THEORY">THEORY</option>
                <option value="SESSIONALS">SESSIONALS</option>
                <option value="QUESTION_BANK">QUESTION BANK</option>
              </select>
              <input
                type="number"
                step="0.5"
                placeholder="Credits (optional)"
                value={courseForm.credits}
                onChange={(e) => setCourseForm({ ...courseForm, credits: e.target.value })}
              />
              <input
                type="text"
                placeholder="Instructor (optional)"
                value={courseForm.instructor}
                onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
              />
              <button type="submit" disabled={loading}>Add Course</button>
            </form>

            <div className="admin-list">
              {courses.map((course) => (
                <div key={course._id} className="admin-list-item">
                  <div className="admin-item-main">
                    <strong>{course.code}</strong>
                    <span>{course.name}</span>
                    <small>{course.section}</small>
                  </div>
                  <div className="admin-item-actions">
                    <button type="button" onClick={() => handleUpdateCourse(course)}>Edit</button>
                    <button type="button" className="danger-btn" onClick={() => handleDeleteCourse(course._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'materials' && (
          <div>
            <h2>Add Material</h2>
            <form onSubmit={handleAddMaterial}>
              <input
                type="text"
                placeholder="Material title"
                value={materialForm.title}
                onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Instructor (required for grouping)"
                value={materialForm.instructor}
                onChange={(e) => setMaterialForm({ ...materialForm, instructor: e.target.value })}
                required
              />
              <select
                value={materialForm.course}
                onChange={(e) => setMaterialForm({ ...materialForm, course: e.target.value })}
                required
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
              <select
                value={materialForm.type}
                onChange={(e) => setMaterialForm({ ...materialForm, type: e.target.value })}
                required
              >
                <option value="PDF">PDF</option>
                <option value="DOC">DOC</option>
                <option value="SPREADSHEET">SPREADSHEET</option>
                <option value="VIDEO">VIDEO</option>
                <option value="FOLDER">FOLDER</option>
              </select>
              <input
                type="url"
                placeholder="Google Drive Link"
                value={materialForm.googleDriveLink}
                onChange={(e) => setMaterialForm({ ...materialForm, googleDriveLink: e.target.value })}
                required
              />
              <textarea
                placeholder="Description (optional)"
                value={materialForm.description}
                onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
              />
              <button type="submit" disabled={loading}>Add Material</button>
            </form>

            <div className="admin-list">
              {materials.map((material) => (
                <div key={material._id} className="admin-list-item">
                  <div className="admin-item-main">
                    <strong>{material.title}</strong>
                    <span>{material.instructor || 'General'}</span>
                    <span>{material.type}</span>
                    <small>{material.googleDriveLink}</small>
                  </div>
                  <div className="admin-item-actions">
                    <button type="button" onClick={() => handleUpdateMaterial(material)}>Edit</button>
                    <button type="button" className="danger-btn" onClick={() => handleDeleteMaterial(material._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div>
            <h2>Publish Notification</h2>
            <form onSubmit={handleCreateNotification}>
              <input
                type="text"
                placeholder="Title"
                value={notificationForm.title}
                onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })}
                required
              />
              <select
                value={notificationForm.type}
                onChange={(e) => setNotificationForm({ ...notificationForm, type: e.target.value })}
              >
                <option value="INFO">INFO</option>
                <option value="UPDATE">UPDATE</option>
                <option value="WARNING">WARNING</option>
                <option value="URGENT">URGENT</option>
              </select>
              <textarea
                placeholder="Message"
                value={notificationForm.message}
                onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })}
                required
              />
              <button type="submit" disabled={loading}>Publish Notification</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
