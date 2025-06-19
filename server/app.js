// app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "../server/db/connect.js";
import students from "../server/routes/students.js";
import cron from 'node-cron';
import axios from 'axios';
import Student from './models/Student.js';
import nodemailer from 'nodemailer';

dotenv.config();

const port = process.env.PORT || 8000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello, Zeeshan!");
});

app.use("/api/v1/students", students);

// Email setup
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// CRON JOB: Fetch Codeforces data for all students with a handle
 const cronSchedule = process.env.CF_CRON_SCHEDULE || '0 2 * * *'; // Default: 2 AM daily



cron.schedule(cronSchedule, async () => {
  console.log('Running Codeforces data sync cron job...');
  try {
    const students = await Student.find({ codeforcesHandle: { $exists: true, $ne: '' } });
    const now = Date.now();
    for (const student of students) {
      try {
        const [contestRes, submissionRes] = await Promise.all([
          axios.get(`https://codeforces.com/api/user.rating?handle=${student.codeforcesHandle}`),
          axios.get(`https://codeforces.com/api/user.status?handle=${student.codeforcesHandle}`)
        ]);
        student.codeforcesData = {
          contestHistory: contestRes.data,
          submissions: submissionRes.data
        };
        student.cfLastUpdated = new Date();
        await student.save();
        console.log(`Updated Codeforces data for ${student.name} (${student.codeforcesHandle})`);

        // Check for submissions in the last 7 days
        if (student.emailRemindersEnabled) {
          const submissions = submissionRes.data.result || [];
          const recent = submissions.some(sub =>
            now - sub.creationTimeSeconds * 1000 <= 7 * 24 * 60 * 60 * 1000 && sub.verdict === 'OK'
          );
          if (!recent) {
            // Send reminder email
            try {
              await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: student.email,
                subject: 'Codeforces Activity Reminder',
                text: `Hi ${student.name},\n\nWe noticed you haven't made any Codeforces submissions in the last 7 days. Get back to problem solving!\n\nBest,\nStudent Tracker Team`,
              });
              student.reminderCount = (student.reminderCount || 0) + 1;
              await student.save();
              console.log(`Reminder email sent to ${student.email}`);
            } catch (emailErr) {
              console.error(`Failed to send reminder email to ${student.email}:`, emailErr.message);
            }
          }
        }
      } catch (err) {
        console.error(`Failed to update Codeforces data for ${student.name}:`, err.message);
      }
    }
  } catch (err) {
    console.error('Error in Codeforces data sync cron job:', err.message);
  }
});

// Start the server
const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  }
};

startServer();
