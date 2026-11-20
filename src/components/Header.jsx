import React from 'react';

export default function Header({ serverHealth }) {
  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="brand-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
        <div className="brand-titles">
          <h1>
            Express Dev Simulator Playground
            <span className="badge-version">v1.0.0</span>
          </h1>
          <div className="brand-tagline">
            Official Live Demonstration for <code>express-dev-simulator</code> npm package
          </div>
        </div>
      </div>

      <div className="header-actions">
        <div className="pill-link pill-status" title="Express backend status">
          <span className="dot-pulse"></span>
          <span>{serverHealth ? `Backend Active (Uptime: ${serverHealth.uptime}s)` : 'Connecting...'}</span>
        </div>

        <a
          href="https://www.npmjs.com/package/express-dev-simulator"
          target="_blank"
          rel="noopener noreferrer"
          className="pill-link pill-npm"
          title="View published package on npmjs.com"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M0 0v24h24V0H0zm19.5 19.5h-4.5V9h-3v10.5H4.5V4.5h15v15z" />
          </svg>
          <span>npm package</span>
        </a>
      </div>
    </header>
  );
}
