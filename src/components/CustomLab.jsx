import React, { useState } from 'react';

export default function CustomLab({ onExecute, isLoading, isActive }) {
  const [minDelay, setMinDelay] = useState(600);
  const [maxDelay, setMaxDelay] = useState(1500);
  const [failureRate, setFailureRate] = useState(0.4);
  const [failureStatus, setFailureStatus] = useState(503);

  const handleMinChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setMinDelay(val);
    if (val > maxDelay) {
      setMaxDelay(val);
    }
  };

  const handleMaxChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (val >= minDelay) {
      setMaxDelay(val);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onExecute({
      minDelay,
      maxDelay,
      failureRate,
      failureStatus,
      enabled: true
    });
  };

  return (
    <div className={`custom-lab-card ${isActive ? 'active' : ''}`}>
      <div className="lab-header">
        <h4>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
          Interactive Simulator Lab
        </h4>
        <span className="badge-param">Dynamic Configuration</span>
      </div>

      <p className="card-desc" style={{ marginBottom: '16px' }}>
        Adjust the parameters below to test custom middleware configurations dynamically using the published <code>express-dev-simulator</code> instance on the backend.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="lab-controls">
          <div className="control-group">
            <div className="control-label">
              <span>minDelay:</span>
              <span className="control-value">{minDelay} ms</span>
            </div>
            <input
              type="range"
              min="0"
              max="3000"
              step="50"
              value={minDelay}
              onChange={handleMinChange}
              className="range-slider"
            />
          </div>

          <div className="control-group">
            <div className="control-label">
              <span>maxDelay:</span>
              <span className="control-value">{maxDelay} ms</span>
            </div>
            <input
              type="range"
              min={minDelay}
              max="5000"
              step="50"
              value={maxDelay}
              onChange={handleMaxChange}
              className="range-slider"
            />
          </div>

          <div className="control-group">
            <div className="control-label">
              <span>failureRate:</span>
              <span className="control-value">{Math.round(failureRate * 100)}% ({failureRate})</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={failureRate}
              onChange={(e) => setFailureRate(parseFloat(e.target.value))}
              className="range-slider"
            />
          </div>

          <div className="control-group">
            <div className="control-label">
              <span>failureStatus:</span>
              <span className="control-value">HTTP {failureStatus}</span>
            </div>
            <select
              value={failureStatus}
              onChange={(e) => setFailureStatus(parseInt(e.target.value, 10))}
              className="select-input"
            >
              <option value="503">503 Service Unavailable</option>
              <option value="500">500 Internal Server Error</option>
              <option value="502">502 Bad Gateway</option>
              <option value="504">504 Gateway Timeout</option>
              <option value="400">400 Bad Request</option>
              <option value="401">401 Unauthorized</option>
              <option value="403">403 Forbidden</option>
              <option value="404">404 Not Found</option>
            </select>
          </div>
        </div>

        <div className="card-footer" style={{ borderTopColor: 'rgba(56, 189, 248, 0.2)' }}>
          <span className="endpoint-url">
            <code>POST /api/simulate</code>
          </span>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                <span>Testing...</span>
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>Execute Custom Simulation</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
