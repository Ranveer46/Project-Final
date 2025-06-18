import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";

import "./App.css";
import NavBar from "./components/NavBar.js";
import StudentList from "./components/StudentList.js";
import StudentForm from "./components/StudentForm.js";
import UpdateStudent from "./components/UpdateStudent.js";
import StudentProfile from './components/StudentProfile';
import LandingPage from './components/LandingPage';

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'bg-dark text-light' : '';
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className={theme === 'dark' ? 'bg-dark text-light min-vh-100' : ''}>
      <NavBar theme={theme} onThemeToggle={handleThemeToggle} logoSrc="/logo.png" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/students" element={<StudentList />} />
        <Route path="/StudentForm" element={<StudentForm />} />
        <Route path="/UpdateStudent/:id" element={<UpdateStudent />} />
        <Route path="/StudentProfile/:id" element={<StudentProfile />} />
      </Routes>
    </div>
  );
}

export default App;
