# Quick Reference - KUET Textile 2k24

## 🚀 Starting the Application

### Start Backend
```bash
cd server
npm start
```
Backend runs on: `http://localhost:5000`

### Start Frontend (new terminal)
```bash
cd client
npm start
```
Frontend runs on: `http://localhost:3000`

---

## 🛠️ Common Commands

### Backend

| Command | Purpose |
|---------|---------|
| `npm start` | Run production server |
| `npm run dev` | Run with auto-reload (needs nodemon) |
| `npm install` | Install dependencies |

### Frontend

| Command | Purpose |
|---------|---------|
| `npm start` | Run dev server (auto-opens browser) |
| `npm run build` | Build for production |
| `npm test` | Run tests |
| `npm install` | Install dependencies |

---

## 🔑 First Time Setup

1. **Update admin roll number:**
   
   Edit `server/.env`:
   ```env
   ADMIN_ROLL=your_roll_number
   ```

2. **Start MongoDB:**
   ```bash
   mongod
   ```

3. **Start Backend:**
   ```bash
   cd server && npm start
   ```

4. **Start Frontend (new terminal):**
   ```bash
   cd client && npm start
   ```

5. **Register & Login:**
   - Go to `http://localhost:3000`
   - Click "Register"
   - Enter roll number matching `ADMIN_ROLL`
   - You now have admin access!

---

## 📁 File Locations

### Important Config Files
- `server/.env` - Backend configuration
- `client/.env` - Frontend configuration
- `server/index.js` - Backend entry point
- `client/src/App.js` - Frontend entry point

### API Routes
- `server/routes/` - All API endpoints
- `server/models/` - Database schemas

### React Components
- `client/src/pages/` - Page components
- `client/src/components/` - Reusable components
- `client/src/styles/` - CSS files

---

## 🌐 API Endpoints

### Auth
```
POST   /api/auth/register     - Create account
POST   /api/auth/login        - Login
GET    /api/auth/user         - Get profile
```

### Content
```
GET    /api/courses           - List courses
POST   /api/courses           - Add course (admin)
GET    /api/materials         - List materials
POST   /api/materials         - Add material (admin)
```

### Admin
```
GET    /api/notifications     - Get notifications
POST   /api/notifications     - Create notification (admin)
```

### Q&A
```
GET    /api/qa                - Get questions
POST   /api/qa                - Ask question
POST   /api/qa/:id/answer     - Answer question
```

---

## 🐛 Troubleshooting Quick Fixes

### Port already in use
- **Backend:** `netstat -ano | findstr :5000` (Windows)
- Kill process and restart

### MongoDB connection failed
- Start MongoDB: `mongod`
- Check `MONGODB_URI` in `server/.env`

### "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Blank page / not loading
- Open browser console (F12)
- Check for errors
- Make sure backend is running on :5000

---

## 📊 Database Models

### User
- name, roll, email, password, isAdmin

### Semester
- name, level (1-1 to 4-2), description

### Course
- name, code, semester, section, credits, instructor

### Chapter
- title, number, course, description

### Material
- title, description, chapter, googleDriveLink, type, uploadedBy

### Notification
- title, message, type, createdBy, readBy

### Question
- title, content, askedBy, course, answers

---

## 🎨 Colors

- Primary: `#1e3a5f` (Deep Blue)
- Secondary: `#d4a574` (Gold)
- Accent: `#2d5a8c` (Medium Blue)
- Light: `#f5f5f5` (Background)

---

## 📝 Creating Content (As Admin)

1. Go to `http://localhost:3000/admin`
2. Use Admin Dashboard to:
   - Add Semesters (1-1, 1-2, etc.)
   - Add Courses to each semester
   - Add Chapters to each course
   - Add Materials with Google Drive links

---

## 📱 Responsive Breakpoints

- **Mobile:** < 480px
- **Tablet:** 480px - 768px
- **Desktop:** > 768px

---

## 🚀 Deployment Ready

Files included for deployment:
- `server/.env` - Configure for production
- `client/package.json` - Build script included
- `server/index.js` - Ready for Heroku/AWS/DigitalOcean
- `client/build/` - Production build output

---

## 📞 Need Help?

1. Check [SETUP_GUIDE.md](SETUP_GUIDE.md)
2. Check [server/README.md](server/README.md)
3. Check [client/README.md](client/README.md)
4. Check browser console for errors (F12)

---

**Happy coding! 🎉**
