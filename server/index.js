// server/index.js
const path = require('path');
const express = require('express');
const { simulator } = require('express-dev-simulator');

const app = express();

// Parse JSON bodies
app.use(express.json());

// Global logging middleware for debugging demo requests
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path.startsWith('/api') || req.path === '/health') {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// -------------------------------------------------------------
// Health Check Endpoint (Excluded from simulation)
// -------------------------------------------------------------
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// -------------------------------------------------------------
// Package Metadata Endpoint
// -------------------------------------------------------------
app.get('/api/package-info', (req, res) => {
  res.status(200).json({
    packageName: 'express-dev-simulator',
    packageVersion: '1.0.0',
    npmUrl: 'https://www.npmjs.com/package/express-dev-simulator',
    nodeEnv: process.env.NODE_ENV || 'development',
    productionOverrideActive: true,
    supportedOptions: {
      enabled: 'boolean (default true; auto-disables in production unless explicitly passed)',
      minDelay: 'number (ms >= 0)',
      maxDelay: 'number (ms >= minDelay)',
      failureRate: 'number (0.0 to 1.0)',
      failureStatus: 'number (400 to 599)',
      exclude: 'string[] (exact paths to bypass)',
      rng: 'function (for deterministic testing)'
    }
  });
});

// -------------------------------------------------------------
// Test A: Normal API Endpoint (No Simulator Middleware)
// -------------------------------------------------------------
app.get('/api/normal', (req, res) => {
  res.status(200).json({
    status: 'success',
    type: 'normal',
    message: 'Immediate response from normal Express endpoint (no simulator middleware applied)',
    serverTimestamp: new Date().toISOString(),
    data: {
      item: 'Production Server Metrics',
      simulatedDelay: '0ms',
      simulatedFailureRate: '0%',
      systemStatus: 'healthy',
      package: 'express-dev-simulator',
      version: '1.0.0'
    }
  });
});

// -------------------------------------------------------------
// Test B: Delay Simulation Endpoint
// Genuine express-dev-simulator middleware configured with delay
// -------------------------------------------------------------
app.get(
  '/api/delayed',
  simulator({
    enabled: true, // Explicit override ensuring it works in production environments
    minDelay: 1200,
    maxDelay: 2000,
    failureRate: 0,
    failureStatus: 500
  }),
  (req, res) => {
    res.status(200).json({
      status: 'success',
      type: 'delayed',
      message: 'Delayed response completed successfully via express-dev-simulator middleware',
      configuredSimulation: {
        enabled: true,
        minDelay: 1200,
        maxDelay: 2000,
        failureRate: 0,
        expectedDelayRange: '1200ms - 2000ms'
      },
      serverTimestamp: new Date().toISOString(),
      data: {
        batchId: 'batch_sim_7721',
        itemsProcessed: 42,
        status: 'Completed with simulated network latency'
      }
    });
  }
);

// -------------------------------------------------------------
// Test C: Probabilistic Failure Simulation Endpoint
// Genuine express-dev-simulator middleware configured with failure rate
// -------------------------------------------------------------
app.get(
  '/api/failure',
  simulator({
    enabled: true, // Explicit override ensuring it works in production environments
    minDelay: 300,
    maxDelay: 600,
    failureRate: 0.6, // 60% probability of failure
    failureStatus: 503 // HTTP 503 Service Unavailable
  }),
  (req, res) => {
    res.status(200).json({
      status: 'success',
      type: 'failure_simulation',
      message: 'Request succeeded! By probability (40% chance), this request bypassed the 60% failure threshold.',
      configuredSimulation: {
        enabled: true,
        minDelay: 300,
        maxDelay: 600,
        failureRate: 0.6,
        failureStatus: 503
      },
      serverTimestamp: new Date().toISOString(),
      note: 'Failures are probabilistic. Retry multiple times to observe the simulated 503 Service Unavailable responses.'
    });
  }
);

// -------------------------------------------------------------
// Test D: Custom Simulation Lab Endpoint
// Applies express-dev-simulator dynamically with user-selected parameters
// -------------------------------------------------------------
app.post('/api/simulate', (req, res, next) => {
  try {
    const {
      minDelay = 500,
      maxDelay = 1000,
      failureRate = 0.5,
      failureStatus = 500,
      enabled = true
    } = req.body;

    // Use the actual published middleware factory from express-dev-simulator
    const dynamicMiddleware = simulator({
      enabled: Boolean(enabled),
      minDelay: Math.max(0, parseInt(minDelay, 10) || 0),
      maxDelay: Math.max(0, parseInt(maxDelay, 10) || 0),
      failureRate: Math.min(1, Math.max(0, parseFloat(failureRate) || 0)),
      failureStatus: parseInt(failureStatus, 10) || 500
    });

    // Execute the generated express-dev-simulator middleware
    dynamicMiddleware(req, res, () => {
      // If not halted by simulator middleware failure, send success payload
      res.status(200).json({
        status: 'success',
        type: 'custom_simulation',
        message: 'Custom simulation request completed successfully through express-dev-simulator!',
        appliedConfig: {
          enabled: Boolean(enabled),
          minDelay: parseInt(minDelay, 10),
          maxDelay: parseInt(maxDelay, 10),
          failureRate: parseFloat(failureRate),
          failureStatus: parseInt(failureStatus, 10)
        },
        serverTimestamp: new Date().toISOString()
      });
    });
  } catch (err) {
    // Return any validation error thrown directly by express-dev-simulator
    res.status(400).json({
      status: 'error',
      message: err.message || 'Validation error in express-dev-simulator'
    });
  }
});

// -------------------------------------------------------------
// Static Frontend Serving (Vite build)
// -------------------------------------------------------------
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Catch-all fallback for client-side routing (non-API routes)
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head><title>Express Dev Simulator Playground</title></head>
          <body style="font-family: sans-serif; padding: 40px; background: #0f172a; color: #f8fafc;">
            <h1>Express Dev Simulator Playground</h1>
            <p>API server is active. Build the frontend with <code>npm run build</code> to view the dashboard.</p>
            <p><a href="/api/normal" style="color: #38bdf8;">Test Normal Endpoint</a></p>
            <p><a href="/api/delayed" style="color: #38bdf8;">Test Delayed Endpoint</a></p>
            <p><a href="/api/failure" style="color: #38bdf8;">Test Failure Endpoint</a></p>
          </body>
        </html>
      `);
    }
  });
});

// -------------------------------------------------------------
// Start Server with Graceful Port Selection
// -------------------------------------------------------------
const DEFAULT_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
const HOST = '0.0.0.0';

function startServer(port) {
  const server = app.listen(port, HOST, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Express Dev Simulator Playground is running!`);
    console.log(`👉 Open in browser: http://localhost:${port}`);
    console.log(`📡 Health Check:    http://localhost:${port}/health`);
    console.log(`🌐 Network host:    http://${HOST}:${port}`);
    console.log(`⚙️  Environment:     ${process.env.NODE_ENV || 'development'}`);
    console.log(`======================================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && !process.env.PORT) {
      console.warn(`⚠️  Port ${port} is occupied, automatically trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });

  return server;
}

if (require.main === module) {
  startServer(DEFAULT_PORT);
}

module.exports = app;
