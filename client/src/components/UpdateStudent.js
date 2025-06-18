import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { css } from "@emotion/react";
import { BarLoader } from "react-spinners";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const UpdateStudent = () => {
  const { id } = useParams();
  const [value, setValue] = useState({
    studentID: "",
    name: "",
    phone: "",
    email: "",
    grades: "",
    currentRating:"",
    maxRating:"",
    codeforcesHandle:"",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch student details when component mounts
    fetchStudentDetails();
  }, [id]);

  const fetchStudentDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/students/${id}`
      );
      const data = await response.json();
      const studentDetails = data.student;

      setValue({
        studentID: studentDetails.studentID,
        name: studentDetails.name,
        phone: studentDetails.phone,
        email: studentDetails.email,
        grades: studentDetails.grades,
        codeforcesHandle:studentDetails.codeforcesHandle,
        currentRating:studentDetails.currentRating,
        maxRating:studentDetails.maxRating,
      });
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  const setData = (e) => {
    const { name, value } = e.target;

    setValue((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const updateStudent = async (e) => {
    e.preventDefault();

    setLoading(true);
    setTimeout(async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/students/${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(value),
          }
        );

        if (response.ok) {
          // Redirect or perform any other action upon successful update
          console.log("Student updated successfully!");
          // Reset form data after successful update
          setValue({
            studentID: "",
            name: "",
            phone: "",
            email: "",
            grades: "",
            codeforcesHandle:"",
currentRating:"",
maxRating:"",
          });
          navigate("/"); // Redirect to home or any other page
        } else {
          console.error("Error updating student:", response.statusText);
        }
      } catch (error) {
        console.error("Error updating student:", error);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <Link to="/" className="btn btn-secondary mt-4 mb-4">
            Back to Home
          </Link>

          <div className="card">
            <div className="card-header">
              <h3 className="mb-0"> Update Student Information</h3>
            </div>
            <div className="card-body">
              <form onSubmit={updateStudent}>
                {/* Student ID */}
                <div className="form-group">
                  <label htmlFor="studentID">ID</label>
                  <input
                    type="text"
                    className="form-control"
                    id="studentID"
                    placeholder="Student ID"
                    onChange={setData}
                    value={value.studentID}
                    name="studentID"
                  />
                </div>

                {/* Student Name */}
                <div className="form-group mt-2">
                  <label htmlFor="studentName">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="studentName"
                    placeholder="Student Name"
                    onChange={setData}
                    value={value.name}
                    name="name"
                  />
                </div>

                {/* Phone */}
                <div className="form-group mt-2">
                  <label htmlFor="studentPhone">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    id="studentPhone"
                    placeholder="Student Phone"
                    onChange={setData}
                    value={value.phone}
                    name="phone"
                  />
                </div>

                {/* Email */}
                <div className="form-group mt-2">
                  <label htmlFor="studentEmail">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="studentEmail"
                    placeholder="Student Email"
                    onChange={setData}
                    value={value.email}
                    name="email"
                  />
                </div>

                {/* Grade */}
                <div className="form-group mt-2">
                  <label htmlFor="studentGrade">Grade</label>
                  <input
                    type="text"
                    className="form-control"
                    id="studentGrade"
                    placeholder="Student Grade"
                    onChange={setData}
                    value={value.grades}
                    name="grades"
                  />
                </div>

                {/* Codeforces Handle */}
                <div className="form-group mt-2">
                  <label htmlFor="codeforcesHandle">Codeforces Handle</label>
                  <input
                    type="text"
                    className="form-control"
                    id="codeforcesHandle"
                    placeholder="Codeforces Handle"
                    onChange={setData}
                    value={value.codeforcesHandle}
                    name="codeforcesHandle"
                  />
                </div>

                {/* Current Rating */}
                <div className="form-group mt-2">
                  <label htmlFor="currentRating">Current Rating</label>
                  <input
                    type="number"
                    className="form-control"
                    id="currentRating"
                    placeholder="Current Rating"
                    onChange={setData}
                    value={value.currentRating}
                    name="currentRating"
                  />
                </div>

                {/* Max Rating */}
                <div className="form-group mt-2">
                  <label htmlFor="maxRating">Max Rating</label>
                  <input
                    type="number"
                    className="form-control"
                    id="maxRating"
                    placeholder="Max Rating"
                    onChange={setData}
                    value={value.maxRating}
                    name="maxRating"
                  />
                </div>

                <button type="submit" className="btn btn-primary mt-3">
                  {loading ? (
                    <BarLoader
                      color={"#ffffff"}
                      loading={loading}
                      css={override}
                      size={150}
                    />
                  ) : (
                    "Update"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateStudent;
