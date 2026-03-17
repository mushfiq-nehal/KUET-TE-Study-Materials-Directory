const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');
require('dotenv').config();

const app = express();

// Force Node DNS to use public resolvers (some routers reject SRV queries).
dns.setServers(['8.8.8.8', '1.1.1.1']);
dns.setDefaultResultOrder('ipv4first');

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/textile-eng-2k24';
let hasLoggedMongoConnection = false;

const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const isOriginAllowed = (origin) => {
  return allowedOrigins.some((allowedOrigin) => {
    if (allowedOrigin === '*') {
      return true;
    }

    if (allowedOrigin === origin) {
      return true;
    }

    if (allowedOrigin.startsWith('*.')) {
      try {
        const requestHost = new URL(origin).hostname;
        const suffix = allowedOrigin.slice(2);
        return requestHost === suffix || requestHost.endsWith(`.${suffix}`);
      } catch (err) {
        return false;
      }
    }

    return false;
  });
};

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.length === 0 || isOriginAllowed(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
};

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    maxPoolSize: 10,
  });

  if (!hasLoggedMongoConnection) {
    hasLoggedMongoConnection = true;
    console.log('MongoDB connected');
  }
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '6mb' }));
app.use(express.urlencoded({ extended: true, limit: '6mb' }));
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/semesters', require('./routes/semesterRoutes'));
app.use('/api/materials', require('./routes/materialRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/qa', require('./routes/qaRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

app.use((err, req, res, next) => {
  if (err && err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Request payload is too large. Please upload a smaller image.' });
  }

  if (err) {
    console.error('Unhandled server error:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }

  next();
});

const PORT = process.env.PORT || 5000;

const startLocalServer = async () => {
  try {
    await connectToDatabase();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

if (process.env.VERCEL !== '1') {
  startLocalServer();
}

module.exports = app;
