import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { startOfYear, endOfToday, format } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
} from 'chart.js';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ExtensionIcon from '@mui/icons-material/Extension';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const contestFilters = [30, 90, 365];
const problemFilters = [7, 30, 90];

const chipStyle = {
  fontSize: '1em',
  padding: '0.4em 1em',
  borderRadius: '1em',
  marginRight: '0.5em',
  fontWeight: 600,
  background: 'linear-gradient(90deg, #e3e3e3 60%, #c1e1ff 100%)',
  color: '#333',
  display: 'inline-block',
  marginBottom: '0.5em',
};
const chipGreen = { ...chipStyle, background: 'linear-gradient(90deg, #d1e7dd 60%, #b6f0c1 100%)', color: '#155724' };
const chipBlue = { ...chipStyle, background: 'linear-gradient(90deg, #c1e1ff 60%, #b6d0ff 100%)', color: '#0d47a1' };
const chipPurple = { ...chipStyle, background: 'linear-gradient(90deg, #e1c1ff 60%, #d0b6ff 100%)', color: '#6f42c1' };
const chipRed = { ...chipStyle, background: 'linear-gradient(90deg, #ffd1d1 60%, #ffb6b6 100%)', color: '#a71d2a' };

const StudentProfile = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [codeforcesData, setCodeforcesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contestFilter, setContestFilter] = useState(90);
  const [problemFilter, setProblemFilter] = useState(30);
  const [showAllSubs, setShowAllSubs] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/students/${id}`);
        const data = await res.json();
        setStudent(data.student);
      } catch (err) {
        setError('Failed to fetch student info');
      }
    };
    fetchStudent();
  }, [id]);

  useEffect(() => {
    const fetchCodeforcesData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/api/v1/students/${id}/codeforces`);
        const data = await res.json();
        setCodeforcesData(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch Codeforces data');
        setLoading(false);
      }
    };
    fetchCodeforcesData();
  }, [id]);

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (error) return <div className="container mt-5 text-danger">{error}</div>;
  if (!student || !codeforcesData) return null;

  // Contest history filtering
  const now = Date.now();
  const contestHistory = (codeforcesData.contestHistory.result || []).filter(contest => {
    const contestTime = contest.ratingUpdateTimeSeconds * 1000;
    return now - contestTime <= contestFilter * 24 * 60 * 60 * 1000;
  });

  // Problem-solving data filtering
  const submissions = (codeforcesData.submissions.result || []);
  const filteredSubs = submissions.filter(sub => {
    const subTime = sub.creationTimeSeconds * 1000;
    return now - subTime <= problemFilter * 24 * 60 * 60 * 1000 && sub.verdict === 'OK';
  });

  // Most difficult problem solved
  let mostDifficult = null;
  filteredSubs.forEach(sub => {
    if (sub.problem.rating) {
      if (!mostDifficult || sub.problem.rating > mostDifficult.problem.rating) {
        mostDifficult = sub;
      }
    }
  });

  // Total problems solved
  const uniqueProblems = new Set(filteredSubs.map(sub => sub.problem.contestId + '-' + sub.problem.index));
  const totalSolved = uniqueProblems.size;

  // Average rating
  const ratings = filteredSubs.map(sub => sub.problem.rating).filter(Boolean);
  const avgRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) : 'N/A';

  // Average problems per day
  const avgPerDay = (totalSolved / problemFilter).toFixed(2);

  // Bar chart data (problems solved per rating bucket)
  const ratingBuckets = {};
  ratings.forEach(r => {
    const bucket = Math.floor(r / 100) * 100;
    ratingBuckets[bucket] = (ratingBuckets[bucket] || 0) + 1;
  });

  // Submission heat map data (by day)
  const allHeatMap = {};
  const okHeatMap = {};
  submissions.forEach(sub => {
    const date = format(new Date(sub.creationTimeSeconds * 1000), 'yyyy-MM-dd');
    allHeatMap[date] = (allHeatMap[date] || 0) + 1;
    if (sub.verdict === 'OK') {
      okHeatMap[date] = (okHeatMap[date] || 0) + 1;
    }
  });
  const heatMapData = Object.entries(showAllSubs ? allHeatMap : okHeatMap).map(([date, count]) => ({ date, count }));

  // Rating graph data
  const ratingLabels = contestHistory.map(contest => new Date(contest.ratingUpdateTimeSeconds * 1000).toLocaleDateString());
  const ratingData = contestHistory.map(contest => contest.newRating);
  const ratingGraphData = {
    labels: ratingLabels,
    datasets: [
      {
        label: 'Rating',
        data: ratingData,
        fill: false,
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.2)',
        tension: 0.1
      }
    ]
  };

  // Verdict donut chart data
  const verdictCounts = { OK: 0, WRONG_ANSWER: 0, COMPILATION_ERROR: 0, TIME_LIMIT_EXCEEDED: 0, MEMORY_LIMIT_EXCEEDED: 0, RUNTIME_ERROR: 0, OTHERS: 0 };
  submissions.forEach(sub => {
    if (verdictCounts.hasOwnProperty(sub.verdict)) {
      verdictCounts[sub.verdict]++;
    } else {
      verdictCounts.OTHERS++;
    }
  });
  const verdictChartData = {
    labels: Object.keys(verdictCounts),
    datasets: [
      {
        data: Object.values(verdictCounts),
        backgroundColor: [
          '#4caf50', '#f44336', '#ff9800', '#2196f3', '#9c27b0', '#ffc107', '#607d8b'
        ]
      }
    ]
  };

  // Problem index bar chart data
  const indexCounts = {};
  filteredSubs.forEach(sub => {
    const idx = sub.problem.index;
    indexCounts[idx] = (indexCounts[idx] || 0) + 1;
  });
  const barChartData = {
    labels: Object.keys(indexCounts),
    datasets: [
      {
        label: 'Problems Solved',
        data: Object.values(indexCounts),
        backgroundColor: '#7c4dff'
      }
    ]
  };

  // Last activity date
  const lastActivity = submissions.length > 0 ?
    new Date(Math.max(...submissions.map(sub => sub.creationTimeSeconds * 1000))).toLocaleDateString() : 'N/A';
  // Activity badge
  const isActive = submissions.some(sub => now - sub.creationTimeSeconds * 1000 <= 7 * 24 * 60 * 60 * 1000 && sub.verdict === 'OK');

  // For heatmap range
  const startDate = format(startOfYear(new Date()), 'yyyy-MM-dd');
  const endDate = format(endOfToday(), 'yyyy-MM-dd');

  return (
    <div className="container mt-4">
      <Link to="/" className="btn btn-secondary mb-3">Back to Home</Link>
      {/* Profile Summary Card */}
      <div className="card mb-4 p-4 d-flex flex-column flex-md-row align-items-center" style={{gap: 24, background: 'linear-gradient(90deg, #e3f2fd 60%, #fff 100%)', border: '1.5px solid #1976d2'}}>
        <div style={{fontSize: 64, marginRight: 32, background: '#1976d2', borderRadius: '50%', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'}}>
          <PersonIcon fontSize="inherit" />
        </div>
        <div className="flex-grow-1">
          <h2 className="mb-1" style={{fontWeight: 700, color: '#1976d2'}}>{student.name}</h2>
          <div style={{fontSize: '1.1em', color: '#555'}}><VerifiedUserIcon style={{fontSize: 18, marginRight: 4, color: '#43a047'}} />@{student.codeforcesHandle}</div>
          <div style={{fontSize: '1em', color: '#888'}}><EmailIcon style={{fontSize: 18, marginRight: 4}} />{student.email}</div>
          <div className="mt-3">
            <span style={chipBlue}>Current Rating: <b>{student.currentRating || 'N/A'}</b></span>
            <span style={chipGreen}>Max Rating: <b>{student.maxRating || 'N/A'}</b></span>
            <span style={chipPurple}>Last Activity: <b>{lastActivity}</b></span>
            <span style={isActive ? {...chipGreen, background: 'linear-gradient(90deg, #b6f0c1 60%, #d1e7dd 100%)'} : chipRed}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card p-4 mb-4" style={{borderLeft: '5px solid #1976d2', background: 'linear-gradient(90deg, #e3f2fd 60%, #fff 100%)'}}>
            <h5 className="mb-3" style={{display: 'flex', alignItems: 'center', color: '#1976d2'}}><EmojiEventsIcon className="me-2"/> Contest History</h5>
            <div className="mb-2">
              Filter:
              {contestFilters.map(days => (
                <button
                  key={days}
                  className={`btn btn-sm ms-2 ${contestFilter === days ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setContestFilter(days)}
                >
                  Last {days} days
                </button>
              ))}
            </div>
            <div className="mb-3 p-2 border bg-light rounded">
              <Line data={ratingGraphData} />
            </div>
            <div style={{maxHeight: 220, overflowY: 'auto'}}>
              <table className="table table-sm table-striped">
                <thead>
                  <tr>
                    <th>Contest</th>
                    <th>Date</th>
                    <th>Rank</th>
                    <th>Old Rating</th>
                    <th>New Rating</th>
                    <th>Change</th>
                    <th>Unsolved</th>
                  </tr>
                </thead>
                <tbody>
                  {contestHistory.map(contest => {
                    // Calculate unsolved problems for this contest
                    const contestSubs = submissions.filter(sub => sub.contestId === contest.contestId && sub.verdict === 'OK');
                    const solvedIndices = new Set(contestSubs.map(sub => sub.problem.index));
                    const maxIndex = Math.max(...contestSubs.map(sub => sub.problem.index.charCodeAt(0)), 65); // 'A' = 65
                    const totalProblems = maxIndex - 65 + 1;
                    const unsolved = totalProblems - solvedIndices.size;
                    return (
                      <tr key={contest.contestId}>
                        <td>{contest.contestName}</td>
                        <td>{new Date(contest.ratingUpdateTimeSeconds * 1000).toLocaleDateString()}</td>
                        <td>{contest.rank}</td>
                        <td>{contest.oldRating}</td>
                        <td>{contest.newRating}</td>
                        <td>{contest.newRating - contest.oldRating}</td>
                        <td>{unsolved >= 0 ? unsolved : 'N/A'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-4 mb-4" style={{borderLeft: '5px solid #7c4dff', background: 'linear-gradient(90deg, #f3e3fd 60%, #fff 100%)'}}>
            <h5 className="mb-3" style={{display: 'flex', alignItems: 'center', color: '#7c4dff'}}><ExtensionIcon className="me-2"/> Problem Solving Data</h5>
            <div className="mb-2">
              Filter:
              {problemFilters.map(days => (
                <button
                  key={days}
                  className={`btn btn-sm ms-2 ${problemFilter === days ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setProblemFilter(days)}
                >
                  Last {days} days
                </button>
              ))}
            </div>
            <div className="mb-3">
              <span style={chipPurple}>Most Difficult: <b>{mostDifficult ? `${mostDifficult.problem.name} (${mostDifficult.problem.rating})` : 'N/A'}</b></span>
              <span style={chipBlue}>Total Solved: <b>{totalSolved}</b></span>
              <span style={chipGreen}>Avg Rating: <b>{avgRating}</b></span>
              <span style={chipBlue}>Avg/Day: <b>{avgPerDay}</b></span>
            </div>
            <div className="mb-3 p-2 border bg-light rounded">
              <Doughnut data={verdictChartData} />
            </div>
            <div className="mb-3 p-2 border bg-light rounded">
              <Bar data={barChartData} />
            </div>
            <div className="mb-3 p-2 border bg-light rounded">
              <div className="d-flex align-items-center mb-2">
                <span style={{ fontWeight: 600, marginRight: 12 }}>Submission Heat Map:</span>
                <button
                  className={`btn btn-sm ${showAllSubs ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setShowAllSubs(!showAllSubs)}
                  style={{ borderRadius: '1em', fontWeight: 600 }}
                >
                  {showAllSubs ? 'Show Only Accepted' : 'Show All Submissions'}
                </button>
              </div>
              <CalendarHeatmap
                startDate={startDate}
                endDate={endDate}
                values={heatMapData}
                classForValue={value => {
                  if (!value || value.count === 0) return 'color-empty';
                  if (value.count >= 8) return 'color-github-4';
                  if (value.count >= 5) return 'color-github-3';
                  if (value.count >= 2) return 'color-github-2';
                  return 'color-github-1';
                }}
                tooltipDataAttrs={value => {
                  if (!value || !value.date) return null;
                  return {
                    'data-tip': `${value.date}: ${value.count} submission${value.count > 1 ? 's' : ''}`
                  };
                }}
                showWeekdayLabels
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile; 