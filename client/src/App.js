import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { apiUrl } from './services/api';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import SemesterPage from './pages/SemesterPage';
import AdminDashboard from './pages/AdminDashboard';
import SearchPage from './pages/SearchPage';
import NotificationsPage from './pages/NotificationsPage';
import QAPage from './pages/QAPage';
import Navigation from './components/Navigation';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and fetch user
      fetch(apiUrl('/api/auth/user'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          setUser(data);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <div className="app-shell">
        <div className="app-content">
          <Navigation user={user} setUser={setUser} />
          <Routes>
            <Route path="/login" element={!user ? <LoginPage setUser={setUser} /> : <Navigate to="/" />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/semester/:id" element={<SemesterPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/notifications" element={<NotificationsPage user={user} />} />
            <Route path="/qa" element={user ? <QAPage /> : <Navigate to="/login" />} />
            <Route path="/admin" element={user?.isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
          </Routes>
        </div>

        <footer className="site-footer">Developed by Md. Maktum Sani - 2421048</footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
