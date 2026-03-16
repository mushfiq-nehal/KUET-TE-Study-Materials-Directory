# KUET Textile Engineering 2k24 - Complete Setup Guide

## Project Overview

A full-stack web application for KUET Textile Engineering 2k24 students to access and manage study materials organized by:
- **Semesters** (1-1, 1-2, 2-1, etc.)
- **Sections** (Theory, Sessionals, Question Bank)
- **Courses** → **Chapters** → **Materials** (Google Drive links)

Plus features like:
✅ User authentication (Roll/Password)
✅ Admin dashboard for content management
✅ Global search
✅ Notifications system
✅ Q&A forum
✅ Modern, mobile-first UI (textile-inspired design)

---

## Prerequisites

- **Node.js** v14+ ([Download](https://nodejs.org/))
- **MongoDB** (Local or MongoDB Atlas cloud)
- **Git** (optional)
- **Code Editor** (VS Code recommended)

---

## Installation & Setup

### Step 1: Setup Backend (Express + MongoDB)

#### 1.1 Navigate to server folder
```bash
cd server
```

#### 1.2 Install dependencies
```bash
npm install
```

#### 1.3 Create/Configure .env file
The `.env` file is already created. Update these values:

```env
MONGODB_URI=mongodb://localhost:27017/textile-eng-2k24
JWT_SECRET=textile_2k24_super_secret_key
PORT=5000
ADMIN_ROLL=your_roll_number_here
NODE_ENV=development
```

**IMPORTANT**: Change `ADMIN_ROLL` to your actual roll number to get admin access.

#### 1.4 Start MongoDB
- **Local MongoDB**: Run `mongod` in terminal
- **MongoDB Atlas**: Update `MONGODB_URI` with your cloud connection string

#### 1.5 Start the backend server
```bash
npm start
```

Expected output:
```
Server running on port 5000
MongoDB connected
```

---

### Step 2: Setup Frontend (React)

#### 2.1 Navigate to client folder
```bash
cd ../client
```

#### 2.2 Install dependencies
```bash
npm install
```

The `.env` file is pre-configured.

#### 2.3 Start the frontend development server
```bash
npm start
```

This automatically opens React app on `http://localhost:3000`

---

## Running the Full Application

### Terminal 1 (Backend)
```bash
cd server
npm start
# Should show: Server running on port 5000, MongoDB connected
```

### Terminal 2 (Frontend)
```bash
cd client
npm start
# Should open http://localhost:3000 in browser
```

---

## First Time Setup - Create Admin Account

1. Go to `http://localhost:3000`
2. Click "Don't have an account? Register"
3. Fill in form with *your roll number* matching `ADMIN_ROLL` in `.env`
4. You'll automatically become admin

Example:
```
Name: Your Name
Roll: 123456 (must match ADMIN_ROLL in .env)
Email: your.email@example.com
Password: your_password
```

---

## Project Structure

```
Website/
├── server/                          # Backend
│   ├── models/                      # MongoDB schemas
│   │   ├── User.js
│   │   ├── Semester.js
│   │   ├── Course.js
│   │   ├── Chapter.js
│   │   ├── Material.js
│   │   ├── Notification.js
│   │   └── Question.js
│   ├── controllers/                 # Business logic
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── materialController.js
│   │   ├── notificationController.js
│   │   └── qaController.js
│   ├── routes/                      # API endpoints
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── materialRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── qaRoutes.js
│   ├── middleware/                  # Authentication, etc.
│   │   └── auth.js
│   ├── index.js                     # Server entry point
│   ├── .env                         # Configuration
│   └── package.json
│
├── client/                          # Frontend
│   ├── src/
│   │   ├── pages/                   # Page components
│   │   │   ├── LoginPage.js
│   │   │   ├── HomePage.js
│   │   │   ├── SemesterPage.js
│   │   │   ├── SearchPage.js
│   │   │   ├── NotificationsPage.js
│   │   │   ├── QAPage.js
│   │   │   └── AdminDashboard.js
│   │   ├── components/              # Reusable components
│   │   │   ├── Navigation.js
│   │   │   ├── SemesterCard.js
│   │   │   └── CourseList.js
│   │   ├── styles/                  # CSS modules
│   │   ├── App.js
│   │   └── index.js
│   ├── .env                         # Configuration
│   └── package.json
│
├── README.md                        # Root readme
└── .github/copilot-instructions.md  # Project checklist
```

---

## Features Implemented

### ✅ Authentication
- Register with roll, email, password
- Login with roll, password
- JWT token management
- Admin role detection

### ✅ Admin Dashboard
- Manage semesters
- Add/delete courses
- Add/delete chapters
- Add/delete materials
- Create notifications

### ✅ Student Features
- View semesters (1-1 through 4-2)
- Browse courses by section (Theory, Sessionals, Question Bank)
- View chapters and materials
- Click to access Google Drive links
- Search materials globally
- View notifications
- Ask questions in Q&A forum
- Answer other students' questions

### ✅ UI/UX
- Mobile-first responsive design
- Textile-inspired color scheme
- Smooth animations and hover effects
- Fast loading and transitions
- Works on all devices (phone, tablet, desktop)

---

## API Documentation

### Authentication Endpoints
```
POST   /api/auth/register     - Create new account
POST   /api/auth/login        - Login and get JWT token
GET    /api/auth/user         - Get current user profile
```

### Courses & Materials
```
GET    /api/courses           - List courses
POST   /api/courses           - Create course (admin)
GET    /api/courses/chapters  - List chapters
POST   /api/courses/chapters  - Create chapter (admin)
GET    /api/materials         - List materials
POST   /api/materials         - Add material with Google Drive link (admin)
DELETE /api/materials/:id     - Delete material (admin)
```

### Notifications
```
GET    /api/notifications     - Get all notifications
POST   /api/notifications     - Create notification (admin)
PUT    /api/notifications/:id/read - Mark as read
```

### Q&A
```
GET    /api/qa                - Get all questions
POST   /api/qa                - Ask new question
POST   /api/qa/:id/answer     - Answer question
```

---

## Troubleshooting

### Problem: "Cannot GET /api/..."
**Solution**: Make sure backend is running on port 5000
```bash
cd server && npm start
```

### Problem: MongoDB connection error
**Solution**: 
- Ensure MongoDB is running (`mongod`)
- Or update `MONGODB_URI` in `.env` to use MongoDB Atlas

### Problem: Port 3000/5000 already in use
**Solution**: Kill the process or change ports in `.env`

### Problem: npm dependencies issues
**Solution**: Delete `node_modules` and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Adding Data to MongoDB

Once logged in as admin, use the Admin Dashboard to:
1. Create Semesters (1-1, 1-2, etc.)
2. Create Courses for each semester
3. Create Chapters for each course
4. Add Materials (link to Google Drive folders/files)

---

## Color Scheme

**Textile-Inspired Design**:
- Primary Blue: `#1e3a5f` - Professional, structured
- Gold Accent: `#d4a574` - Textile warmth
- Medium Blue: `#2d5a8c` - Gradient element
- Light Background: `#f5f5f5`

---

## Next Steps / Future Features

- [ ] File uploads directly to server
- [ ] Offline mode with Service Workers
- [ ] Push notifications
- [ ] User profiles with download history
- [ ] Advanced search filters
- [ ] Bookmark materials
- [ ] Analytics dashboard
- [ ] Dark mode toggle

---

## Support & Questions

For issues or questions about the setup:
1. Check MongoDB connection
2. Verify `.env` files in both server and client
3. Ensure Node.js v14+ is installed
4. Check terminal console for error messages

---

## Deployment (Future)

When ready to deploy:

**Backend** → Heroku / AWS / DigitalOcean
**Frontend** → Netlify / Vercel / GitHub Pages
**Database** → MongoDB Atlas

---

**Happy coding! 🎉**
