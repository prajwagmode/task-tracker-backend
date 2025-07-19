// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const wss = require('./websocket');
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // You can restrict to your frontend later
    methods: ["GET", "POST"]
  }
});

// === Middleware ===
app.use(cors());
app.use(express.json());

// === Socket.io Connection ===
io.on('connection', (socket) => {
  console.log('🔌 A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ A user disconnected:', socket.id);
  });
});

// Save the io instance for use in routes
app.set('io', io);

// === Route Imports ===
const testRoutes = require('./routes/test');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task.routes');
const projectRoutes = require('./routes/project.routes');

// === Route Definitions ===
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api', testRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects/:projectId/tasks', taskRoutes);

// === Logger ===
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// === Health Check ===
app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
});

app.get('/test', (req, res) => {
  res.send('Test route working');
});

// === MongoDB Connection and Server Start ===
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5050;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
