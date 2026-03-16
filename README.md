# KUET Textile Engineering 2k24 - Study Materials Directory

A modern, full-stack web application for KUET Textile Engineering students to access and manage study materials organized by semester, course, and chapter.

## 🚀 Quick Start

### Prerequisites
- Node.js v14+
- MongoDB (local or Atlas)
- Two terminals

### Start Backend
```bash
cd server
npm start
# Runs on http://localhost:5000
```

### Start Frontend (in new terminal)
```bash
cd client
npm start
# Runs on http://localhost:3000
```

**Then open:** http://localhost:3000

## ✨ Features

- 📚 **Semester-wise Directory** - All 8 semesters (1-1 to 4-2)
- 📖 **Course Organization** - Theory, Sessionals, Question Bank sections
- 🔗 **Google Drive Integration** - Direct links to materials
- 🔍 **Global Search** - Find materials across all semesters
- 🔔 **Notifications** - Stay updated with announcements
- ❓ **Q&A Forum** - Ask and answer questions
- 🎨 **Mobile-First UI** - Works perfectly on all devices
- 🔐 **Secure** - JWT authentication, password hashing
- 👨‍💼 **Admin Dashboard** - Manage all content

## 📖 Documentation

- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - What was built
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete setup instructions
- **[DEPLOY_VERCEL.md](DEPLOY_VERCEL.md)** - Production deployment on Vercel (frontend + backend)
- **[server/README.md](server/README.md)** - Backend API docs
- **[client/README.md](client/README.md)** - Frontend docs

## ⚙️ Configuration

Update your roll number for admin access:

**server/.env:**
```
ADMIN_ROLL=your_roll_number_here
```

## 🎨 Design

- **Color Scheme**: Textile-inspired (deep blue + gold)
- **Responsive**: Mobile, tablet, desktop optimized
- **Modern**: Smooth animations, professional UI

## 📁 Project Structure

```
├── server/          # Express + MongoDB backend
├── client/          # React frontend
├── SETUP_GUIDE.md   # Detailed instructions
└── PROJECT_SUMMARY  # Complete overview
```

## 🎯 First Use

1. Register with your roll number
2. If it matches `ADMIN_ROLL` in `.env`, you get admin access
3. Use Admin Dashboard to add semesters, courses, materials
4. Share the link with other students

## 🚨 Need Help?

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for:
- Detailed installation steps
- MongoDB setup
- Troubleshooting
- API documentation
