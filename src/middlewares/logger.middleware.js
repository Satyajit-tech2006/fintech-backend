export const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const user = req.user ? `| User: ${req.user.email} ` : '| Unauthenticated ';
    
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${user}| Status: ${res.statusCode} | ${duration}ms`
    );
  });

  next();
};