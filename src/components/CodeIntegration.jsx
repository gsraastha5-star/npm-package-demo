import React, { useState } from 'react';

export default function CodeIntegration() {
  const [activeTab, setActiveTab] = useState('import');
  const [copied, setCopied] = useState(false);

  const snippets = {
    import: `// 1. Installation
// In your project directory:
// npm install express-dev-simulator

// 2. Importing into your Express Application
// CommonJS (Node.js conventional):
const { simulator } = require('express-dev-simulator');

// Or ES Modules:
// import { simulator } from 'express-dev-simulator';

const express = require('express');
const app = express();`,

    delay: `// -------------------------------------------------------------
// Route-Level Artificial Delay Simulation
// -------------------------------------------------------------
const express = require('express');
const { simulator } = require('express-dev-simulator');

const app = express();

// Apply express-dev-simulator middleware to a specific route
app.get(
  '/api/delayed',
  simulator({
    enabled: true,         // Explicit override (ensures execution in production)
    minDelay: 1200,        // Minimum artificial delay in milliseconds
    maxDelay: 2000,        // Maximum artificial delay in milliseconds
    failureRate: 0,        // 0% failure probability
    failureStatus: 500     // Default status code
  }),
  (req, res) => {
    // This handler will only execute after the simulated delay completes!
    res.json({
      status: 'success',
      message: 'Delayed response completed successfully via express-dev-simulator',
      simulatedDelayRange: '1200ms - 2000ms'
    });
  }
);`,

    failure: `// -------------------------------------------------------------
// Probabilistic Failure Simulation
// -------------------------------------------------------------
const express = require('express');
const { simulator } = require('express-dev-simulator');

const app = express();

app.get(
  '/api/failure',
  simulator({
    enabled: true,         // Active in all environments
    minDelay: 300,         // Optional delay before triggering failure
    maxDelay: 600,
    failureRate: 0.6,      // 60% probability of request failing
    failureStatus: 503     // Injects HTTP 503 Service Unavailable
  }),
  (req, res) => {
    // If the request fails, express-dev-simulator halts execution
    // and sends HTTP 503 with body "Simulated failure".
    // If it survives the 60% probability, this handler runs:
    res.json({
      status: 'success',
      message: 'Request survived the failure probability threshold!'
    });
  }
);`,

    production: `// -------------------------------------------------------------
// Production Safety Mechanism in express-dev-simulator
// -------------------------------------------------------------
// By default, the published package checks:
// const isProd = process.env.NODE_ENV === 'production';
// const effectiveEnabled = isProd && !hasEnabled ? false : config.enabled;

// 1. SAFE BY DEFAULT:
// If you omit 'enabled', the package automatically disables itself in production:
app.use(simulator({ minDelay: 500, maxDelay: 1000 })); 
// In production (NODE_ENV=production), this acts as a no-op pass-through!

// 2. EXPLICIT PRODUCTION OVERRIDE:
// For live demonstration environments (like this Render deployment),
// pass 'enabled: true' explicitly:
app.use(simulator({
  enabled: true, // Overrides the production auto-disable check
  minDelay: 500,
  maxDelay: 1000
}));`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="integration-section">
      <div className="section-header">
        <h3>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6"/>
            <polyline points="8 6 2 12 8 18"/>
          </svg>
          Package Integration & Real Code Reference
        </h3>
        <span className="badge-param">Matches Active Backend Implementation</span>
      </div>

      <p className="card-desc">
        The snippets below reflect the exact code executing in this playground's backend server (<code>server/index.js</code>), importing directly from <code>express-dev-simulator</code>.
      </p>

      <div className="tabs-nav">
        <button
          className={`tab-btn ${activeTab === 'import' ? 'active' : ''}`}
          onClick={() => setActiveTab('import')}
        >
          1. Import & Setup
        </button>
        <button
          className={`tab-btn ${activeTab === 'delay' ? 'active' : ''}`}
          onClick={() => setActiveTab('delay')}
        >
          2. Delay Middleware
        </button>
        <button
          className={`tab-btn ${activeTab === 'failure' ? 'active' : ''}`}
          onClick={() => setActiveTab('failure')}
        >
          3. Failure Simulation
        </button>
        <button
          className={`tab-btn ${activeTab === 'production' ? 'active' : ''}`}
          onClick={() => setActiveTab('production')}
        >
          4. Production Safety & Override
        </button>
      </div>

      <div className="code-container">
        <button className="code-copy-btn" onClick={handleCopy}>
          {copied ? (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              <span>Copy Code</span>
            </>
          )}
        </button>
        <pre>{snippets[activeTab]}</pre>
      </div>
    </div>
  );
}
