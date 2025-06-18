// routes/studentRoutes.js
import express from "express";
const router = express.Router();

import {
  getAllStudents,
  createStudent,
  getStudent,
  updateStudent,
  deleteStudent,
  downloadStudentsCSV,
  getCodeforcesData,
} from "../controllers/students.js";

router.route("/").get(getAllStudents).post(createStudent);
router.route("/:id").get(getStudent).patch(updateStudent).delete(deleteStudent);
router.route("/download/csv").get(downloadStudentsCSV);
router.route("/:id/codeforces").get(getCodeforcesData);

export default router;
