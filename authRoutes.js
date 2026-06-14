const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

const config = require('./config');
const connectDB = require('./config/db');
const { apiLimiter } = require('./middleware/validate');
const { notFound, errorHandler } = require('./middleware/error');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Render / proxies sit in front of the app — needed for secure cookies & rate limit
app.set('trust proxy', 1);

/* ---------------------------------- Security --------------------------------- */
app.use(helmet());

/* ------------------------------------ CORS ----------------------------------- */
// The frontend runs on a DIFFERENT origin (e.g. another Render static site or
// localhost:3000), so we must allow that origin and send credentials (cookies).
const corsOptions = {
  origin(origin, callback) {
    // Allow same-origin / server-to-server (no origin header)
    if (!origin) return callback(null, true);
    // If no allowlist configured, reflect the request origin (dev convenience)
    if (!config.clientOrigins.length) return callback(null, true);
    if (config.clientOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-CSRF-Token', 'Authorization'],
};
app.use(cors(corsOptions));

/* ---------------------------------- Parsers ---------------------------------- */
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(config.sessionSecret));

/* ------------------------------- Rate limiting ------------------------------- */
app.use('/api', apiLimiter);

/* ----------------------------------- CSRF ------------------------------------ */
// Double-submit cookie pattern. Cross-site cookies require SameSite=None+Secure
// in production. The token is exposed via GET /api/csrf-token and must be
// echoed back in the X-CSRF-Token header on mutating requests.
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: config.isProd,
    sameSite: config.isProd ? 'none' : 'lax',
  },
});

app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

/* ----------------------------------- Health ---------------------------------- */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'marsh-api', time: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ service: 'Marsh API', health: '/api/health' });
});

/* ----------------------------------- Routes ---------------------------------- */
app.use('/auth', csrfProtection, authRoutes);
app.use('/api/user', csrfProtection, userRoutes);
app.use('/api/admin', csrfProtection, adminRoutes);

/* ------------------------------- Error handling ------------------------------ */
app.use(notFound);
app.use(errorHandler);

/* ------------------------------------ Boot ----------------------------------- */
const start = async () => {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`Marsh API running on port ${config.port} [${config.env}]`);
  });
};

start();

module.exports = app;
