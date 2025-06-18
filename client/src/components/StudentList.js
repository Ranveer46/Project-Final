import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import VisibilityIcon from '@mui/icons-material/Visibility';
import Switch from '@mui/material/Switch';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  useEffect(() => {
    // Fetch data from backend when the component mounts
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/students");
      const data = await response.json();
      setStudents(data.students);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDeleteClick = (studentId) => {
    setSelectedStudentId(studentId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirmation = async () => {
    try {
      // Perform the deletion here
      const response = await fetch(
        `http://localhost:8000/api/v1/students/${selectedStudentId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Optionally update the UI or perform any other action upon successful deletion
        console.log("Student deleted successfully!");
        setDeleteModalOpen(false);
        fetchData(); // Fetch updated data after deletion
      } else {
        console.error("Error deleting student:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/students/download/csv');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'students.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };

  const handleToggleReminder = async (studentId, currentValue) => {
    try {
      await fetch(`http://localhost:8000/api/v1/students/${studentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailRemindersEnabled: !currentValue })
      });
      fetchData();
    } catch (error) {
      console.error('Error toggling email reminder:', error);
    }
  };

  return (
    <div className="mt-5">
      <div className="container">
        <div className="add-btn-container mt-2 text-center">
          <Link to="/StudentForm">
            <button className="btn btn-primary me-2">Add Student</button>
          </Link>
          <button className="btn btn-success" onClick={handleDownloadCSV}>Download CSV</button>
        </div>

        <table className="table table-hover mt-3">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Phone</th>
              <th scope="col">Codeforces Handle</th>
              <th scope="col">Current Rating</th>
              <th scope="col">Max Rating</th>
              <th scope="col">CF Last Updated</th>
              <th scope="col">Reminders Sent</th>
              <th scope="col">Email Reminders</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.phone}</td>
                <td>{student.codeforcesHandle}</td>
                <td>{student.currentRating}</td>
                <td>{student.maxRating}</td>
                <td>{student.cfLastUpdated ? new Date(student.cfLastUpdated).toLocaleString() : 'N/A'}</td>
                <td>{student.reminderCount || 0}</td>
                <td>
                  <Switch
                    checked={student.emailRemindersEnabled}
                    onChange={() => handleToggleReminder(student._id, student.emailRemindersEnabled)}
                    color="primary"
                  />
                </td>
                <td className="d-flex justify-content-around">
                  <Link to={`/UpdateStudent/${student._id}`}>
                    <button className="btn btn-primary me-1" title="Edit">
                      <EditIcon style={{ fontSize: 18 }} />
                    </button>
                  </Link>
                  <button
                    className="btn btn-danger me-1"
                    title="Delete"
                    onClick={() => handleDeleteClick(student._id)}
                  >
                    <DeleteIcon style={{ fontSize: 18 }} />
                  </button>
                  <Link to={`/StudentProfile/${student._id}`}>
                    <button className="btn btn-info" title="View Details">
                      <VisibilityIcon style={{ fontSize: 18 }} />
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          closeModal={() => setDeleteModalOpen(false)}
          onDelete={handleDeleteConfirmation}
        />
      </div>
    </div>
  );
};

export default StudentList;
