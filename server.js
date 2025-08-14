import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './src/config/db.js';
import authRoutes from './src/routes/auth.routes.js';
import adminRoutes from './src/routes/admin.routes.js';
import userRoutes from './src/routes/user.routes.js';
import { notFound, errorHandler } from './src/middlewares/error.js';

const app = express();

// Middlewares globaux
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Connexion DB
await connectDB();

// Routes API
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

// Dashboards HTML simples
app.get('/admin', (req, res) => res.redirect('/admin/dashboard'));
app.get('/user', (req, res) => res.redirect('/user/dashboard'));

// 404 + handler
app.use(notFound);
app.use(errorHandler);

// Lancement serveur
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
