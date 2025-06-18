# Student Tracker MERN

A full-stack web application to manage, track, and motivate students in competitive programming using the MERN stack (MongoDB, Express.js, React, Node.js). The app features Codeforces integration, automated reminders, and rich analytics.

---

## Features

- **Student Management:** Add, update, delete, and view student records.
- **Codeforces Integration:** Syncs contest history and submissions for each student with a Codeforces handle.
- **Automated Email Reminders:** Sends inactivity reminders to students who haven't submitted on Codeforces recently.
- **Analytics Dashboard:** Visualizes student progress, rating history, problem-solving stats, and more.
- **CSV Export:** Download all student data as a CSV file.
- **Modern UI:** Responsive React frontend with Material UI and Bootstrap.

---

## Tech Stack

- **Frontend:** React, Material UI, Bootstrap, Chart.js
- **Backend:** Node.js, Express.js, Mongoose, Nodemailer, node-cron
- **Database:** MongoDB

---

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm
- MongoDB database (local or cloud)

### 1. Clone the Repository
```bash
git clone <repo-url>
cd student-tracker-mern-main
```

### 2. Install Dependencies
Install for both client and server:
```bash
cd client
npm install
cd ../server
npm install
```

### 3. Environment Variables
Create a `.env` file in `server/` with the following:
```
MONGO_URI=<your-mongodb-uri>
PORT=8000
EMAIL_SERVICE=gmail
EMAIL_USER=<your-email>
EMAIL_PASS=<your-email-password-or-app-password>
CF_CRON_SCHEDULE=0 2 * * *
```
- `MONGO_URI`: MongoDB connection string
- `EMAIL_*`: For sending reminders (Gmail recommended; use an app password if 2FA is enabled)
- `CF_CRON_SCHEDULE`: Cron schedule for Codeforces sync (default: daily at 2 AM)

### 4. Start the Server
```bash
cd server
npm start
```

### 5. Start the Client
```bash
cd ../client
npm start
```
The client runs on [http://localhost:3000](http://localhost:3000) and the server on [http://localhost:8000](http://localhost:8000).

---

## Usage
- **Add Student:** Fill out the form with student details and (optionally) their Codeforces handle.
- **View Students:** See a list of all students, their ratings, and activity.
- **Profile Page:** Click a student to view detailed analytics, rating graphs, solved problems, and more.
- **Edit/Delete:** Update or remove student records.
- **Download CSV:** Export all student data.
- **Email Reminders:** Toggle reminders for each student.

---

## API Endpoints

- `GET    /api/v1/students` — List all students
- `POST   /api/v1/students` — Add a new student
- `GET    /api/v1/students/:id` — Get a student by ID
- `PATCH  /api/v1/students/:id` — Update a student
- `DELETE /api/v1/students/:id` — Delete a student
- `GET    /api/v1/students/download/csv` — Download all students as CSV
- `GET    /api/v1/students/:id/codeforces` — Get Codeforces data for a student

---

## Student Model
- `studentID` (String, required, unique)
- `name` (String, required)
- `phone` (String)
- `email` (String, required, unique)
- `grades` (String)
- `codeforcesHandle` (String)
- `currentRating` (Number)
- `maxRating` (Number)
- `codeforcesData` (Object)
- `cfLastUpdated` (Date)
- `reminderCount` (Number)
- `emailRemindersEnabled` (Boolean)




