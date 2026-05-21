import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import issueRoutes from './routes/issueRoutes.js';
import path from 'path'
import { fileURLToPath } from 'url'



// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userFrontend = path.join(__dirname, 'dist')

// Standard Middlewares
// app.use(cors({
//   origin: function (origin, callback) {
//     const allowed = [
//       /\.vercel\.app$/,
//       /localhost/
//     ];
//     if (!origin || allowed.some(r => r.test(origin))) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);

// Root Endpoint
app.use(express.static(userFrontend))

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(userFrontend,'index.html'))
})

// Fallback Route for Undefined Endpoints
app.use((req, res) => {
  res.status(404).json({ message: 'API Route Not Found' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
