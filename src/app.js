import express from 'express';
import { 
  securityHeaders, 
  corsConfig, 
  parameterPollution, 
  globalLimiter 
} from './middlewares/security.middleware.js';

import authRoutes from './routes/auth.route.js';
import recordRoutes from './routes/record.route.js';
import userRoutes from './routes/user.route.js';

const app = express();

app.use(securityHeaders);
app.use(corsConfig);
app.use(globalLimiter);

app.use(express.json({ limit: '10kb' })); 
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(parameterPollution);

app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;