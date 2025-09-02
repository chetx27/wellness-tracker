const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();

// Import route modules
const authRoutes = require('./routes/auth');
const habitsRoutes = require('./routes/habits');
const moodRoutes = require('./routes/mood');
const studyRoutes = require('./routes/study');
const periodRoutes = require('./routes/period');
const insightsRoutes = require('./routes/insights');

// Import database
const db = require('./database/database');

class BloomWellServer {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.environment = process.env.NODE_ENV || 'development';
        
        this.initializeMiddleware();
        this.initializeRoutes();
        this.initializeErrorHandling();
        this.initializeDatabase();
    }

    initializeMiddleware() {
        // Security middleware
        this.app.use(helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
                    fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
                    scriptSrc: ["'self'", "'unsafe-inline'"],
                    imgSrc: ["'self'", "data:", "https:"]
                }
            }
        }));

        // Rate limiting
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // limit each IP to 100 requests per windowMs
            message: 'Too many requests from this IP, please try again later.',
            standardHeaders: true,
            legacyHeaders: false
        });
        this.app.use(limiter);

        // CORS configuration
        this.app.use(cors({
            origin: this.environment === 'production' 
                ? ['https://bloomwell.com', 'https://www.bloomwell.com']
                : ['http://localhost:3000', 'http://127.0.0.1:3000'],
            credentials: true
        }));

        // Logging
        this.app.use(morgan(this.environment === 'production' ? 'combined' : 'dev'));

        // Compression
        this.app.use(compression());

        // Body parsing
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

        // Static files
        this.app.use(express.static(path.join(__dirname, 'public')));
        
        // Serve the main HTML file
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'index.html'));
        });
    }

    initializeRoutes() {
        // Health check endpoint
        this.app.get('/health', (req, res) => {
            res.status(200).json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                environment: this.environment
            });
        });

        // API routes
        this.app.use('/api/auth', authRoutes);
        this.app.use('/api/habits', habitsRoutes);
        this.app.use('/api/mood', moodRoutes);
        this.app.use('/api/study', studyRoutes);
        this.app.use('/api/period', periodRoutes);
        this.app.use('/api/insights', insightsRoutes);

        // Wellness data endpoints
        this.app.get('/api/wellness/summary', this.getWellnessSummary.bind(this));
        this.app.post('/api/wellness/checkin', this.createWellnessCheckin.bind(this));

        // Catch-all route for SPA
        this.app.get('*', (req, res) => {
            if (req.path.startsWith('/api/')) {
                res.status(404).json({ error: 'API endpoint not found' });
            } else {
                res.sendFile(path.join(__dirname, 'index.html'));
            }
        });
    }

    initializeErrorHandling() {
        // 404 handler
        this.app.use((req, res, next) => {
            const error = new Error(`Path ${req.originalUrl} not found`);
            error.status = 404;
            next(error);
        });

        // Global error handler
        this.app.use((error, req, res, next) => {
            const status = error.status || 500;
            const message = error.message || 'Internal Server Error';
            
            // Log error in production
            if (this.environment === 'production') {
                console.error(`[${new Date().toISOString()}] ${status} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            } else {
                console.error(error);
            }

            res.status(status).json({
                error: {
                    message: this.environment === 'production' && status === 500 
                        ? 'Internal Server Error' 
                        : message,
                    status: status,
                    timestamp: new Date().toISOString()
                }
            });
        });
    }

    async initializeDatabase() {
        try {
            await db.initialize();
            console.log('Database initialized successfully');
        } catch (error) {
            console.error('Database initialization failed:', error);
            process.exit(1);
        }
    }

    // Wellness API endpoints
    async getWellnessSummary(req, res) {
        try {
            const userId = req.user?.id || 'anonymous';
            
            const summary = {
                habits: await this.getHabitsSummary(userId),
                mood: await this.getMoodSummary(userId),
                study: await this.getStudySummary(userId),
                period: await this.getPeriodSummary(userId),
                insights: await this.generateInsights(userId)
            };

            res.json(summary);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch wellness summary' });
        }
    }

    async createWellnessCheckin(req, res) {
        try {
            const userId = req.user?.id || 'anonymous';
            const { mood, energy, habits, notes } = req.body;

            const checkin = {
                userId,
                mood,
                energy,
                habits,
                notes,
                timestamp: new Date().toISOString()
            };

            await db.createWellnessCheckin(checkin);

            res.status(201).json({
                message: 'Wellness check-in recorded successfully',
                checkin
            });
        } catch (error) {
            res.status(500).json({ error: 'Failed to record wellness check-in' });
        }
    }

    async getHabitsSummary(userId) {
        // Mock implementation - replace with actual database queries
        return {
            totalHabits: 4,
            completedToday: 3,
            longestStreak: 15,
            completionRate: 75
        };
    }

    async getMoodSummary(userId) {
        return {
            averageMood: 4.2,
            trend: 'improving',
            lastWeekAverage: 3.8
        };
    }

    async getStudySummary(userId) {
        return {
            totalSessions: 12,
            totalMinutes: 450,
            averageSessionLength: 37.5,
            mostProductiveHour: '10:00'
        };
    }

    async getPeriodSummary(userId) {
        return {
            cycleLength: 28,
            periodLength: 5,
            daysUntilNext: 11,
            lastPeriod: '2025-08-26'
        };
    }

    async generateInsights(userId) {
        return [
            {
                type: 'mood',
                title: 'Mood Improvement',
                description: 'Your mood has improved by 15% this week, correlating with consistent morning meditation.',
                priority: 'high'
            },
            {
                type: 'sleep',
                title: 'Optimal Sleep Duration',
                description: 'You perform best with 7.5 hours of sleep based on your energy levels.',
                priority: 'medium'
            },
            {
                type: 'study',
                title: 'Peak Performance Hours',
                description: 'Your focus is 20% higher during morning study sessions (9-11 AM).',
                priority: 'medium'
            }
        ];
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`
╭─────────────────────────────────────────╮
│              BloomWell Server           │
│         Wellness Refined                │
├─────────────────────────────────────────┤
│ Environment: ${this.environment.padEnd(24)} │
│ Port:        ${this.port.toString().padEnd(24)} │
│ Status:      Running                    │
│ Time:        ${new Date().toLocaleTimeString().padEnd(24)} │
╰─────────────────────────────────────────╯
            `);

            if (this.environment === 'development') {
                console.log(`\nLocal access: http://localhost:${this.port}`);
                console.log(`Network access: http://127.0.0.1:${this.port}`);
                console.log(`API documentation: http://localhost:${this.port}/health\n`);
            }
        });

        // Graceful shutdown
        process.on('SIGTERM', this.gracefulShutdown.bind(this));
        process.on('SIGINT', this.gracefulShutdown.bind(this));
    }

    async gracefulShutdown(signal) {
        console.log(`\nReceived ${signal}. Starting graceful shutdown...`);
        
        // Close database connections
        try {
            await db.close();
            console.log('Database connections closed.');
        } catch (error) {
            console.error('Error closing database:', error);
        }

        console.log('BloomWell server shutdown complete.');
        process.exit(0);
    }
}

// Start the server
const server = new BloomWellServer();
server.start();

module.exports = BloomWellServer;