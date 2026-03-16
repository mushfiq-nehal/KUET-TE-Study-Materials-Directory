import React, { useEffect, useState } from 'react';
import '../styles/Search.css';
import { apiUrl } from '../services/api';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [semester, setSemester] = useState('');
  const [section, setSection] = useState('');
  const [semesters, setSemesters] = useState([]);
  const [results, setResults] = useState({ courses: [], materials: [], total: 0 });
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(apiUrl('/api/semesters'))
      .then((res) => res.json())
      .then((data) => setSemesters(data))
      .catch(() => setSemesters([]));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearched(true);
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.set('q', searchTerm.trim());
      if (semester) params.set('semester', semester);
      if (section) params.set('section', section);

      const response = await fetch(apiUrl(`/api/search?${params.toString()}`));
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Search failed');
      }

      setResults(data);
    } catch (err) {
      setError(err.message);
      setResults({ courses: [], materials: [], total: 0 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <h1>🔍 Search</h1>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search courses and materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select value={semester} onChange={(e) => setSemester(e.target.value)}>
            <option value="">All Semesters</option>
            {semesters.map((item) => (
              <option key={item._id} value={item._id}>
                {item.level}
              </option>
            ))}
          </select>
          <select value={section} onChange={(e) => setSection(e.target.value)}>
            <option value="">All Sections</option>
            <option value="THEORY">THEORY</option>
            <option value="SESSIONALS">SESSIONALS</option>
            <option value="QUESTION_BANK">QUESTION BANK</option>
          </select>
          <button type="submit">Search</button>
        </form>
      </div>

      {searched && (
        <div className="search-results">
          {loading && <p>Searching...</p>}
          {error && <p>{error}</p>}

          {!loading && !error && results.total === 0 ? (
            <p>No results found</p>
          ) : (
            !loading &&
            !error && (
              <>
                {results.courses.length > 0 && (
                  <>
                    <h2>Courses ({results.courses.length})</h2>
                    {results.courses.map((course) => (
                      <div key={course._id} className="result-item">
                        <h3>{course.code} - {course.name}</h3>
                        <p>
                          {course.semester?.level} {course.section}
                          {course.instructor ? ` | ${course.instructor}` : ''}
                        </p>
                      </div>
                    ))}
                  </>
                )}

                {results.materials.length > 0 && (
                  <>
                    <h2>Materials ({results.materials.length})</h2>
                    {results.materials.map((material) => (
                      <div key={material._id} className="result-item">
                        <h3>{material.title}</h3>
                        <p>
                          {material.course?.code ? `${material.course.code} - ` : ''}
                          {material.instructor || 'General'} | {material.type}
                        </p>
                        <p>
                          <a href={material.googleDriveLink} target="_blank" rel="noreferrer">
                            Open Material
                          </a>
                        </p>
                      </div>
                    ))}
                  </>
                )}
              </>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
