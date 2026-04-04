import express from 'express';
import cookieParser from 'cookie-parser';
import { 
  securityHeaders, 
  corsConfig, 
  parameterPollution, 
  globalLimiter 
} from './middlewares/security.middleware.js';
import { addRequestId, requestLogger } from './middlewares/logger.middleware.js';

import authRoutes from './routes/auth.route.js';
import recordRoutes from './routes/record.route.js';
import userRoutes from './routes/user.route.js';

import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';


const app = express();

let swaggerDocument;
try {
  swaggerDocument = YAML.load(path.join(process.cwd(), 'swagger.yaml'));
} catch (e) {
  console.error("Swagger file not found, docs will be disabled.");
}

if (swaggerDocument) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.use(requestLogger);
app.use(addRequestId);

app.use(securityHeaders);
app.use(corsConfig);
app.use(globalLimiter);

app.use(express.json({ limit: '10kb' })); 
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(parameterPollution);

app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.use((err, req, res, next) => {
  console.error(`[Trace: ${req.id}] Unhandled Error:`, err.stack);
  
  res.status(500).json({ 
    success: false, 
    message: 'Internal Server Error',
    traceId: req.id 
  });
});


export default app;