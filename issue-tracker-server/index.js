import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import issueRoutes from './routes/issueRoutes.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Standard Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/issues', issueRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Issue Tracker API is running...');
});

// Fallback Route for Undefined Endpoints
app.use((req, res) => {
  res.status(404).json({ message: 'API Route Not Found' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
