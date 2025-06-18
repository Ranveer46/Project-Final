import React from 'react';
import { Link } from 'react-router-dom';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ExtensionIcon from '@mui/icons-material/Extension';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const features = [
  {
    icon: <EmojiEventsIcon style={{ fontSize: 36, color: '#1976d2' }} />,
    title: 'Track Progress',
    desc: 'Monitor student performance and contest history in real time.'
  },
  {
    icon: <ExtensionIcon style={{ fontSize: 36, color: '#7c4dff' }} />,
    title: 'Codeforces Integration',
    desc: 'Automatic sync with Codeforces for up-to-date ratings and problems.'
  },
  {
    icon: <NotificationsActiveIcon style={{ fontSize: 36, color: '#43a047' }} />,
    title: 'Automated Reminders',
    desc: 'Send inactivity reminders and keep students motivated.'
  }
];

const LandingPage = () => {
  return (
    <div className="landing-hero d-flex flex-column align-items-center justify-content-center min-vh-100 text-center" style={{background: 'linear-gradient(120deg, #e3f2fd 60%, #fff 100%)'}}>
      <img
        src="/logo.png"
        alt="StudentTracker Logo"
        className="landing-logo mb-3 animate-float"
        style={{ width: 120, height: 120, borderRadius: '50%', boxShadow: '0 4px 24px rgba(25, 118, 210, 0.12)' }}
      />
      <h1 className="mb-2 animate-fadein" style={{ fontWeight: 800, fontSize: '2.7rem', color: '#1976d2', letterSpacing: 1 }}>
        StudentTracker
      </h1>
      <h4 className="mb-4 animate-fadein" style={{ color: '#333', fontWeight: 500, maxWidth: 500, margin: '0 auto' }}>
        The modern way to track, motivate, and empower competitive programmers.
      </h4>
      <Link to="/students">
        <button className="btn btn-primary btn-lg animate-fadein" style={{ fontWeight: 600, fontSize: '1.2rem', borderRadius: '2em', padding: '0.7em 2.5em', boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)' }}>
          View Students
        </button>
      </Link>
      <div className="row mt-5 w-100 justify-content-center animate-fadein" style={{ maxWidth: 900 }}>
        {features.map((f, i) => (
          <div key={i} className="col-12 col-md-4 mb-4">
            <div className="card h-100 p-4 text-center feature-card" style={{ border: 'none', borderRadius: '1.2em', boxShadow: '0 2px 16px rgba(25, 118, 210, 0.07)' }}>
              <div className="mb-2">{f.icon}</div>
              <h5 style={{ fontWeight: 700, color: '#1976d2' }}>{f.title}</h5>
              <div style={{ color: '#555', fontSize: '1.05em' }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage; 