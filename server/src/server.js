const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const { errorHandler, notFoundHandler } = require('./utils/error');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const assessmentsRoutes = require('./routes/assessments.routes');
const collegesRoutes = require('./routes/colleges.routes');
const jobsRoutes = require('./routes/jobs.routes');
const resumesRoutes = require('./routes/resumes.routes');
const interviewsRoutes = require('./routes/interviews.routes');
const notificationRoutes = require('./routes/notification.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const app = express();

app.use(helmet());
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000').split(',');
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    // Allow localhost during development
    if (origin.startsWith('http://localhost:')) return callback(null, true);
    // Allow the specific CLIENT_URL set in env
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Allow any Vercel preview/deployment for this project (temporary for easy setup)
    if (origin.endsWith('.vercel.app')) return callback(null, true);

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
// app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));
app.use('/uploads', express.static(require('path').join(process.cwd(), 'uploads')));

app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'EduCareerPrep API is running' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Added for cron-job.org to keep server awake
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/assessments', assessmentsRoutes);
app.use('/api/colleges', collegesRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/resumes', resumesRoutes);
app.use('/api/interviews', interviewsRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;


