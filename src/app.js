import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import recordRoutes from './routes/record.routes.js';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Zorvyn FinTech API is running securely.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;