# CourseDesk – Online Lecture Scheduling System

CourseDesk is a MERN stack-based online lecture scheduling and course management application. It helps administrators manage courses, instructors, and lecture schedules from a centralized dashboard. Instructors can log in separately and view their assigned lectures.

The application includes role-based authentication and prevents an instructor from being assigned multiple lectures on the same date.

---

## Features

### Admin Dashboard

- Secure admin login using JWT authentication.
- Dashboard with course, instructor, and lecture statistics.
- View and manage registered instructors.
- Add new instructors with login credentials.
- Create courses with name, level, description, and image.
- Schedule lectures by selecting courses, batches, instructors, and dates.
- View all scheduled lectures.
- Prevent duplicate lecture assignments for the same instructor on the same date.

### Instructor Dashboard

- Separate instructor login.
- View only lectures assigned to the logged-in instructor.
- View course name, course level, batch name, and lecture date.
- Secure logout functionality.

### Authentication and Security

- Password hashing using bcryptjs.
- JWT-based authentication.
- Role-based authorization for admin and instructor routes.
- Protected API endpoints.
- Passwords are excluded from user listing responses.

---

## Technology Stack

### Frontend

- React.js
- Vite
- JavaScript
- Bootstrap 5
- Bootstrap Icons
- Custom CSS
- Axios
- React Router DOM

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- Multer
- dotenv
- CORS

---

## Project Structure

```text
online-lecture-scheduler/
│
├── README.md
│
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── instructorController.js
│   │   └── lectureController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   └── Lecture.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── instructorRoutes.js
│   │   └── lectureRoutes.js
│   │
│   ├── uploads/
│   ├── server.js
│   ├── seed.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── Login.jsx
    │   ├── Courses.jsx
    │   ├── Instructor.jsx
    │   ├── LectureSchedule.jsx
    │   ├── InstructorDashboard.jsx
    │   ├── main.jsx
    │   └── index.css
    │
    ├── public/
    ├── index.html
    ├── package.json
    └── .env
```

---

## Installation and Setup

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- MongoDB database
- Git

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate into the project:

```bash
cd online-lecture-scheduler
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

ADMIN_PASSWORD=your_admin_password
INSTRUCTOR_PASSWORD=your_instructor_password
```

Use the environment variable names expected by your `seed.js` file. Do not share actual passwords or database credentials publicly.

### 3. Create Demo Users

Run the seed script to create the initial admin and instructor accounts:

```bash
npm run seed
```

Use the email addresses and passwords configured in your seed script when logging in.

### 4. Start Backend Server

```bash
npm run dev
```

The backend server runs at:

```text
http://localhost:5000
```

### 5. Frontend Setup

Open another terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the frontend folder:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The frontend will usually run at:

```text
http://localhost:5173
```

Open this address in your browser to access CourseDesk.

---

## API Documentation

All backend APIs are served through the `/api` base path.

### Authentication APIs

| Method | Endpoint          | Description                     |
| ------ | ----------------- | ------------------------------- |
| POST   | `/api/auth/login` | Login for admin and instructors |

### Instructor APIs

| Method | Endpoint               | Description          |
| ------ | ---------------------- | -------------------- |
| GET    | `/api/instructors`     | Get all instructors  |
| POST   | `/api/instructors/add` | Add a new instructor |

These endpoints require admin authorization.

### Course APIs

| Method | Endpoint           | Description                   |
| ------ | ------------------ | ----------------------------- |
| GET    | `/api/courses`     | Get all courses               |
| GET    | `/api/courses/:id` | Get a specific course         |
| POST   | `/api/courses/add` | Create a course with an image |

Course creation requires admin authorization.

### Lecture APIs

| Method | Endpoint                    | Description                                       |
| ------ | --------------------------- | ------------------------------------------------- |
| GET    | `/api/lectures`             | Get all scheduled lectures                        |
| POST   | `/api/lectures/add`         | Schedule a new lecture                            |
| GET    | `/api/lectures/my-lectures` | Get lectures assigned to the logged-in instructor |

Lecture management requires admin authorization, while the personal lecture endpoint requires instructor authorization.

Protected API requests use the following header:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Lecture Scheduling and Conflict Prevention

CourseDesk includes a scheduling validation system to prevent an instructor from being assigned more than one lecture on the same calendar date.

When creating a lecture:

1. The selected course is validated.
2. The selected instructor is validated.
3. The lecture date is checked.
4. The system checks whether that instructor already has a lecture on the selected date.
5. If a conflict exists, the request is rejected.
6. Otherwise, the lecture is saved in MongoDB.

A unique compound index is implemented in the Lecture model:

```javascript
lectureSchema.index({ instructor: 1, lectureDay: 1 }, { unique: true });
```

This provides database-level protection against duplicate instructor/date assignments.

---

## Database Models

### User

Stores:

- Name
- Email
- Password (hashed)
- Role (admin or instructor)

### Course

Stores:

- Course name
- Level
- Description
- Image path

### Lecture

Stores:

- Course reference
- Batch name
- Instructor reference
- Lecture date
- Calendar date key (`lectureDay`)

---

## Image Upload

Course images are uploaded using Multer middleware and stored in the backend `uploads` directory during local development.

The backend serves uploaded images through:

```text
/uploads
```

For production hosting, configure persistent image storage so uploaded images remain available after server restarts.

---

## Running the Application

Run the backend and frontend in separate terminals.

**Terminal 1 – Backend**

```bash
cd backend
npm run dev
```

**Terminal 2 – Frontend**

```bash
cd frontend
npm run dev
```

---

## Production Build

To generate an optimized frontend build:

```bash
cd frontend
npm run build
```

The generated production files will be available in the `frontend/dist` directory.

---

## Deployment

The application can be deployed using:

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- Image storage: Cloudinary or another persistent storage service

For deployment:

1. Push the source code to GitHub.
2. Deploy the backend and configure its environment variables.
3. Configure persistent course image storage.
4. Deploy the frontend and set `VITE_API_URL` to the deployed backend URL.
5. Configure CORS for the frontend domain.
6. Test both admin and instructor login using the hosted application.

---

## Application Links

**Live Application:**  
TO_BE_ADDED

**Backend API:**  
TO_BE_ADDED

**GitHub Repository:**  
TO_BE_ADDED

---

## Demo Login Credentials

**Admin Account**

- Email: TO_BE_ADDED
- Password: TO_BE_ADDED

**Instructor Account**

- Email: TO_BE_ADDED
- Password: TO_BE_ADDED

Replace these placeholders with dedicated demo account credentials before sharing the assignment. Do not publish private or reused passwords.

---

## Assignment Submission

The following deliverables can be provided along with the application:

- Hosted application URL
- Admin login credentials
- Instructor login credentials
- Source code repository
- Database dump
- Screen recording demonstrating the application
- Project documentation

---

**CourseDesk – Manage learning. Simplify scheduling.**
