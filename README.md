# CourseDesk – Online Lecture Scheduling System

CourseDesk is a MERN stack application for managing courses, instructors, and lecture schedules. Administrators can create courses, register instructors, and schedule lecture batches. Instructors can sign in to view the lectures assigned to their accounts.

## Live Demo

| Service     | URL                                                 |
| ----------- | --------------------------------------------------- |
| Frontend    | https://coursedesk-phi.vercel.app/                  |
| Backend API | https://online-lecture-scheduler-zq5m.onrender.com/ |

## Features

### Admin

- Secure login using JSON Web Tokens (JWT).
- View dashboard statistics and upcoming lectures.
- Add and view courses, including course images.
- Upload course images to Cloudinary.
- Add and manage instructor accounts.
- Schedule lectures by selecting a course, batch name, instructor, and date.
- View all scheduled lectures.
- Prevent an instructor from being assigned more than one lecture on the same calendar date.

### Instructor

- Secure login using an instructor account.
- View only the lectures assigned to the logged-in instructor.
- View course, batch name, and lecture date for each assigned lecture.

## Technology Stack

**Frontend**

- React.js
- Vite
- Bootstrap 5
- Bootstrap Icons
- Axios
- JavaScript

**Backend**

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- Multer
- Cloudinary
- multer-storage-cloudinary
- dotenv
- cors

## Project Structure

```text
online-lecture-scheduler/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── instructorController.js
│   │   └── lectureController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   └── Lecture.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── instructorRoutes.js
│   │   └── lectureRoutes.js
│   ├── uploads/
│   ├── .env.example
│   ├── package.json
│   ├── seed.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Login.jsx
│   │   ├── Courses.jsx
│   │   ├── Instructor.jsx
│   │   ├── LectureSchedule.jsx
│   │   ├── InstructorDashboard.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   └── index.html
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js and npm
- MongoDB database (local MongoDB or MongoDB Atlas)
- Cloudinary account for course image storage
- Git

## Installation and Local Setup

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd online-lecture-scheduler
```

### 2. Configure the Backend

```bash
cd backend
npm install
```

Create a `backend/.env` file with the following environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Get the Cloudinary values from your Cloudinary account dashboard. Keep these values private and never commit the `.env` file.

Start the backend:

```bash
npm run dev
```

The local API will be available at:

```text
http://localhost:5000
```

You can check the backend root endpoint at:

```text
http://localhost:5000/
```

### 3. Create Demo Accounts (If Needed)

From the `backend` directory, run:

```bash
npm run seed
```

The seed script creates the demo account(s) configured in `seed.js` and skips accounts that already exist. Use the credentials configured for your seed setup.

### 4. Configure the Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `frontend/.env` file:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Open the local Vite URL shown in the terminal (commonly `http://localhost:5173`).

Keep both the frontend and backend development servers running while testing.

> Vite environment variables are read when the development server starts. Restart the frontend after changing `frontend/.env`.

## Cloudinary Image Upload

Course images are uploaded to Cloudinary instead of being stored on the backend server's local filesystem.

The image upload process works as follows:

1. The admin selects an image while creating a course.
2. The frontend sends the course details and image as `multipart/form-data`.
3. Multer processes the uploaded image using `multer-storage-cloudinary`.
4. Cloudinary stores the image in the `coursedesk/courses` folder.
5. The backend saves the resulting Cloudinary image URL in the course document in MongoDB.
6. The frontend uses that URL to display the course image.

The upload middleware allows the image formats configured in the backend and applies a 5 MB upload limit.

The backend requires these environment variables:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Cloudinary provides remote image hosting, so images are not dependent on the temporary filesystem of the Render service.

**Note:** Existing course records that contain an old local image path such as `/uploads/...` are not automatically migrated. Upload the image again or update the old database record to use a Cloudinary URL.

## API Reference

All protected routes require the following HTTP header:

```text
Authorization: Bearer <JWT_TOKEN>
```

### Authentication

| Method | Endpoint          | Access | Purpose                                                          |
| ------ | ----------------- | ------ | ---------------------------------------------------------------- |
| POST   | `/api/auth/login` | Public | Sign in with email and password; returns a JWT and user details. |

Example request body:

```json
{
  "email": "admin@example.com",
  "password": "your_password"
}
```

### Instructors

| Method | Endpoint               | Access | Purpose                       |
| ------ | ---------------------- | ------ | ----------------------------- |
| GET    | `/api/instructors`     | Admin  | Get the instructor list.      |
| POST   | `/api/instructors/add` | Admin  | Create an instructor account. |

Example request body:

```json
{
  "name": "Amit Sharma",
  "email": "amit@example.com",
  "password": "choose_a_password"
}
```

### Courses

| Method | Endpoint           | Access             | Purpose                               |
| ------ | ------------------ | ------------------ | ------------------------------------- |
| GET    | `/api/courses`     | Authenticated user | Get all courses.                      |
| GET    | `/api/courses/:id` | Authenticated user | Get a course by ID.                   |
| POST   | `/api/courses/add` | Admin              | Create a course with an image upload. |

For `POST /api/courses/add`, send `multipart/form-data` using these fields:

| Field         | Type       |
| ------------- | ---------- |
| `name`        | Text       |
| `level`       | Text       |
| `description` | Text       |
| `image`       | Image file |

The image field name must be `image` to match the backend upload route (`upload.single("image")`).

### Lectures

| Method | Endpoint                    | Access     | Purpose                                                        |
| ------ | --------------------------- | ---------- | -------------------------------------------------------------- |
| GET    | `/api/lectures`             | Admin      | Get all scheduled lectures with course and instructor details. |
| POST   | `/api/lectures/add`         | Admin      | Schedule a lecture.                                            |
| GET    | `/api/lectures/my-lectures` | Instructor | Get lectures assigned to the logged-in instructor.             |

Example request body:

```json
{
  "course": "MONGODB_COURSE_ID",
  "batchName": "Morning Batch A",
  "instructor": "MONGODB_INSTRUCTOR_ID",
  "lectureDate": "2026-12-21"
}
```

Replace the example IDs with actual MongoDB document IDs returned by the course and instructor APIs.

## Instructor Date-Clash Prevention

The lecture model stores the lecture date and a date-only value (`lectureDay`) in `YYYY-MM-DD` format.

A unique compound MongoDB index is defined on:

```js
{ instructor: 1, lectureDay: 1 }
```

The API also checks whether the instructor already has a lecture on that date before creating a new one.

This prevents an instructor from being assigned multiple lectures on the same calendar date, even if the course or batch is different. A scheduling conflict returns HTTP status `409`.

## Deployment Configuration

### Frontend – Vercel

The frontend is deployed on Vercel.

**Frontend URL:**

https://coursedesk-phi.vercel.app/

Set the following environment variable in the Vercel project:

```env
VITE_API_URL=https://online-lecture-scheduler-zq5m.onrender.com
```

Configure the Vercel project to use the `frontend` directory as its root directory.

Redeploy the frontend after changing environment variables.

### Backend – Render

The backend is deployed on Render.

**Backend URL:**

https://online-lecture-scheduler-zq5m.onrender.com/

Configure the Render service to use the `backend` directory as its root directory.

Typical commands:

```text
Build command: npm install
Start command: npm start
```

Set the following environment variables in the Render dashboard:

```env
MONGO_URI=your_production_mongodb_connection_string
JWT_SECRET=your_production_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Set `PORT` only if required by the hosting provider. Render commonly provides it automatically.

Configure backend CORS to allow the deployed Vercel frontend origin.

Do not upload `.env` files or expose database connection strings, JWT secrets, or Cloudinary API secrets in GitHub or this README.

## Demo and Submission Details

| Item                | Details                                                                            |
| ------------------- | ---------------------------------------------------------------------------------- |
| Hosted Application  | https://coursedesk-phi.vercel.app/                                                 |
| Backend API         | https://online-lecture-scheduler-zq5m.onrender.com/                                |
| Admin Email         | Add your demo admin email                                                          |
| Admin Password      | Share securely with the reviewer                                                   |
| Instructor Email    | Add your demo instructor email                                                     |
| Instructor Password | Share securely with the reviewer                                                   |
| Screen Recording    | https://drive.google.com/file/d/1IKGQBakodUJJaNScCi97q_XSlB_BABd8/view?usp=sharing |
| Source Code         | Add your GitHub repository URL                                                     |
| Database Dump       | Add your database dump link                                                        |

Share dedicated reviewer credentials separately and securely.

Never include personal account passwords, production secrets, JWT secrets, MongoDB connection strings, or Cloudinary API secrets in this document or a public repository.

## Testing Checklist

- [ ] Admin can log in.
- [ ] Instructor can log in.
- [ ] Admin can add and view instructors.
- [ ] Admin can add and view courses.
- [ ] Course images upload to Cloudinary and display correctly after refresh.
- [ ] Admin can schedule a lecture for a course, batch, instructor, and date.
- [ ] A second lecture for the same instructor on the same date is rejected with a conflict response.
- [ ] Admin can view all scheduled lectures.
- [ ] An instructor can view only their own assigned lectures.
- [ ] Logout returns the user to the login page.
- [ ] Hosted frontend and backend work with the deployed database and Cloudinary image storage.

## Security Notes

- Keep backend and frontend `.env` files out of version control.
- Store passwords as hashes; never store or return plain-text passwords.
- Use a strong, unique `JWT_SECRET` in production.
- Keep Cloudinary API credentials private.
- Share only dedicated reviewer/demo credentials.
- Restrict production CORS to the deployed frontend origin where practical.

---

**CourseDesk** — Online Lecture Scheduling System
