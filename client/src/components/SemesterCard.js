import React from 'react';
import { useNavigate } from 'react-router-dom';

const SemesterCard = ({ semester }) => {
  const navigate = useNavigate();

  return (
    <div className="semester-card" onClick={() => navigate(`/semester/${semester._id}`)}>
      <h3>{semester.level}</h3>
      <p>Study materials of the semester</p>
    </div>
  );
};

export default SemesterCard;
