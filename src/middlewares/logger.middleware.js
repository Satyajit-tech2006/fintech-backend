import { randomUUID } from 'crypto';

export const addRequestId = (req, res, next) => {
  req.id = randomUUID();
  // Elite touch: Expose the trace ID to the client in the headers
  res.setHeader('X-Trace-Id', req.id);
  next();
};

export const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const user = req.user ? `| User: ${req.user.email} ` : '| Unauth ';
    
    console.log(
      `[${new Date().toISOString()}] [Trace: ${req.id}] ${req.method} ${req.originalUrl} ${user}| Status: ${res.statusCode} | ${duration}ms`
    );
  });

  next();
};