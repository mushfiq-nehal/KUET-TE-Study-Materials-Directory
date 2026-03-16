import React, { useEffect, useState } from 'react';
import '../styles/Home.css';
import SemesterCard from '../components/SemesterCard';
import { apiUrl } from '../services/api';

const HomePage = () => {
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    fetch(apiUrl('/api/semesters'))
      .then((res) => res.json())
      .then((data) => setSemesters(data))
      .catch((err) => console.error('Error fetching semesters:', err));
  }, []);

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>KUET Textile Engineering 2k24</h1>
        <p>Study Materials Directory</p>
      </header>

      {semesters.length === 0 ? (
        <p>No semesters have been added by admin yet.</p>
      ) : (
        <div className="semesters-grid">
          {semesters.map((sem) => (
            <SemesterCard key={sem._id} semester={sem} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
