import React from 'react';

export default function Hero({ stats }) {
  return (
    <div className="hero-card">
      <div className="hero-content">
        <div className="hero-text">
          <h2>Test Express Middleware Network Latency & Failures in Real-Time</h2>
          <p>
            This interactive playground runs on a conventional Node.js Express server utilizing the published{' '}
            <strong style={{ color: '#38bdf8' }}>express-dev-simulator</strong> package directly from{' '}
            <code>node_modules</code>. Test artificial latency, probabilistic failure rates, and verify production safety mechanisms.
          </p>

          <div className="hero-meta-badges">
            <span className="meta-chip highlight">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              minDelay & maxDelay (ms)
            </span>
            <span className="meta-chip highlight">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              failureRate (0.0 – 1.0)
            </span>
            <span className="meta-chip highlight">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Auto-disabled in Production (with override)
            </span>
            <span className="meta-chip">
              <code>import {`{ simulator }`} from 'express-dev-simulator'</code>
            </span>
          </div>
        </div>

        <div className="hero-quick-stats">
          <div className="stat-item">
            <span className="label">Total Calls</span>
            <span className="value">{stats.totalCalls}</span>
          </div>
          <div className="stat-item">
            <span className="label">Last Latency</span>
            <span className="value">{stats.lastLatency !== null ? `${stats.lastLatency}ms` : '--'}</span>
          </div>
          <div className="stat-item">
            <span className="label">Success / Fail</span>
            <span className="value" style={{ color: stats.failures > 0 ? '#f43f5e' : '#10b981' }}>
              {stats.successes}/{stats.failures}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
