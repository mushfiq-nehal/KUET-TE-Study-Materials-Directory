# KUET Textile Engineering 2k24 - Backend API

Node.js/Express backend for the KUET Textile Engineering study materials directory.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and update values:
```bash
cp .env.example .env
```

**Important:** Change `ADMIN_ROLL` to your roll number and `JWT_SECRET` in production.

### 3. MongoDB Setup
- Install MongoDB locally or use MongoDB Atlas cloud service
- Update `MONGODB_URI` in `.env` with your MongoDB connection string
- Default: `mongodb://localhost:27017/textile-eng-2k24`

## Running the Server

### Development (with auto-reload)
```bash
npm run dev
```
Requires: `npm install -g nodemon`

### Production
```bash
npm start
```

Server runs on `http://localhost:5000`

## Deploy to Vercel

This backend is configured for Vercel serverless deployment via `vercel.json`.

### Vercel project settings
- Root Directory: `server`
- Framework Preset: `Other`

### Required environment variables
- `MONGODB_URI`
- `JWT_SECRET`
- `ADMIN_ROLL`
- `CORS_ORIGINS` (comma-separated frontend origins)

Health endpoint after deploy:

- `GET /api/health`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user` - Get current user (requires auth)

### Materials
- `GET /api/materials` - Get all materials
- `GET /api/materials?chapter=ID` - Get materials by chapter
- `POST /api/materials` - Add material (admin only)
- `DELETE /api/materials/:id` - Delete material (admin only)

### Courses & Chapters
- `GET /api/courses` - Get courses (filter: semester, section)
- `POST /api/courses` - Add course (admin only)
- `GET /api/courses/chapters` - Get chapters
- `POST /api/courses/chapters` - Add chapter (admin only)

### Notifications
- `GET /api/notifications` - Get all notifications
- `POST /api/notifications` - Create notification (admin only)
- `PUT /api/notifications/:id/read` - Mark as read

### Q&A
- `GET /api/qa` - Get questions
- `POST /api/qa` - Ask question
- `POST /api/qa/:id/answer` - Answer question

## Database Models

### User
- name, roll (unique), email (unique), password, isAdmin, createdAt

### Semester
- name, level (1-1, 1-2, etc.), description

### Course
- name, code, semester, section (THEORY/SESSIONALS/QUESTION_BANK), credits, instructor

### Chapter
- title, number, course, description

### Material
- title, description, chapter, googleDriveLink, type, uploadedBy, downloads, createdAt

### Notification
- title, message, type (INFO/WARNING/UPDATE/URGENT), createdBy, readBy[], createdAt

### Question
- title, content, askedBy, course, answers[], upvotes, createdAt

## Security Notes
- Passwords are hashed with bcryptjs
- JWT tokens expire in 30 days
- Admin access requires matching ADMIN_ROLL
- CORS enabled for frontend communication
