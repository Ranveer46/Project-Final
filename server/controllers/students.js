import Student from "../models/Student.js";
import { StatusCodes } from "http-status-codes";
import { stringify } from 'csv-stringify/sync';
import axios from 'axios';

const createStudent = async (req, res, next) => {
  try {
    const { studentID, name, phone, email, grades, codeforcesHandle, currentRating, maxRating } = req.body;

    // Check for duplicate studentID or email
    const existingStudent = await Student.findOne({
      $or: [{ studentID }, { email }],
    });

    if (existingStudent) {
      // Duplicate found, return error response
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "DuplicateData",
        message: "Student with the same ID or email already exists.",
      });
    }

    // Create new student if no duplicate is found
    const newStudent = await Student.create({
      studentID,
      name,
      phone,
      email,
      grades,
      codeforcesHandle,
      currentRating,
      maxRating,
    });

    res.status(StatusCodes.CREATED).json({ student: newStudent });
  } catch (error) {
    next(error);
  }
};

const getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.find({});
    res.status(StatusCodes.OK).json({ students });
  } catch (error) {
    next(error);
  }
};

const getStudentById = async (req, res, next) => {
  try {
    const { id: studentID } = req.params;
    const student = await Student.findById(studentID);

    if (!student) {
      throw new Error(`Student not found with id: ${studentID}`);
    }

    res.status(StatusCodes.OK).json({ student });
  } catch (error) {
    next(error);
  }
};

const updateStudentById = async (req, res, next) => {
  try {
    const { id: studentID } = req.params;
    // Find the current student
    const currentStudent = await Student.findById(studentID);
    if (!currentStudent) {
      throw new Error(`Student not found with id: ${studentID}`);
    }
    const oldHandle = currentStudent.codeforcesHandle;
    const newHandle = req.body.codeforcesHandle;
    // Update the student
    const student = await Student.findByIdAndUpdate(studentID, req.body, {
      new: true,
      runValidators: true,
    });
    // If the handle was changed, fetch new Codeforces data
    if (newHandle && newHandle !== oldHandle) {
      try {
        const [contestRes, submissionRes] = await Promise.all([
          axios.get(`https://codeforces.com/api/user.rating?handle=${newHandle}`),
          axios.get(`https://codeforces.com/api/user.status?handle=${newHandle}`)
        ]);
        student.codeforcesData = {
          contestHistory: contestRes.data,
          submissions: submissionRes.data
        };
        student.cfLastUpdated = new Date();
        await student.save();
      } catch (err) {
        console.error(`Failed to update Codeforces data for ${student.name}:`, err.message);
      }
    }
    res.status(StatusCodes.OK).json({ student });
  } catch (error) {
    next(error);
  }
};

const deleteStudentById = async (req, res, next) => {
  try {
    const { id: studentID } = req.params;
    const student = await Student.findByIdAndDelete(studentID);

    if (!student) {
      throw new Error(`Student not found with id: ${studentID}`);
    }

    res.status(StatusCodes.OK).json({ student });
  } catch (error) {
    next(error);
  }
};

const downloadStudentsCSV = async (req, res, next) => {
  try {
    const students = await Student.find({}).lean();
    if (!students || students.length === 0) {
      return res.status(404).send('No students found');
    }
    // Prepare CSV fields
    const columns = [
      'name',
      'email',
      'phone',
      'codeforcesHandle',
      'currentRating',
      'maxRating',
      'studentID',
      'grades',
    ];
    const csv = stringify(students, { header: true, columns });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="students.csv"');
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

const getCodeforcesData = async (req, res, next) => {
  try {
    const { id: studentID } = req.params;
    const student = await Student.findById(studentID);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    const handle = student.codeforcesHandle;
    if (!handle) {
      return res.status(400).json({ error: 'No Codeforces handle for this student' });
    }
    // Fetch contest history
    const contestRes = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`);
    // Fetch submission history
    const submissionRes = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}`);
    res.status(200).json({
      contestHistory: contestRes.data,
      submissions: submissionRes.data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createStudent,
  getAllStudents,
  getStudentById as getStudent,
  updateStudentById as updateStudent,
  deleteStudentById as deleteStudent,
  downloadStudentsCSV,
  getCodeforcesData,
};
