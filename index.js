import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from './config/passport.js';
import connectToDatabase from './db/db.js';

// Routes
import authRouter from './routes/auth.js';
import listingRouter from './routes/listingRoutes.js';
import showroomRouter from './routes/showroomRoutes.js';
import dashboardRouter from './routes/dashboardRoutes.js';
import favoriteRouter from './routes/favoriteRoutes.js';

// Configs
connectToDatabase();

const app = express();

//*************** CORS CONFIGURATION ***************
app.use(cors({
  origin: 'https://autonexa.vercel.app',
  credentials: true
}));
app.use(express.json());

// Session middleware for Passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Use routes
app.use('/api/auth', authRouter);
app.use('/api/listings', listingRouter);
app.use('/api/showrooms', showroomRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/favorites', favoriteRouter);
app.use('/api/user', authRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));
