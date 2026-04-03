import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import recordRoutes from './routes/record.route.js';
import userRoutes from './routes/user.route.js';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running securely.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;