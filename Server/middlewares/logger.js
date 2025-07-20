const logger = (req, res, next) => {
  const start = Date.now();

  // Log request
  console.log(
    `📥 ${req.method} ${req.url} - ${req.ip} - ${new Date().toISOString()}`
  );

  // Log request body for POST/PUT requests (be careful with sensitive data)
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
    console.log('📄 Request body:', JSON.stringify(req.body, null, 2));
  }

  // Override res.end to log response time
  const originalEnd = res.end;
  res.end = function (...args) {
    const duration = Date.now() - start;
    console.log(
      `📤 ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`
    );
    originalEnd.apply(this, args);
  };

  next();
};

// Request ID middleware
const requestId = (req, res, next) => {
  req.id = Math.random().toString(36).substr(2, 9);
  res.setHeader('X-Request-ID', req.id);
  next();
};

export default logger;
export { requestId };
