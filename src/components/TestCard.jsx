import React from 'react';

export default function TestCard({
  testNumber,
  title,
  method = 'GET',
  endpoint,
  description,
  configParams = [],
  buttonLabel,
  buttonType = 'btn-primary',
  onExecute,
  isLoading,
  isActive,
  allowRetry = false,
  onRetry
}) {
  return (
    <div className={`test-card ${isActive ? 'active' : ''}`}>
      <div className="card-top">
        <div className="card-title-group">
          <span className="test-num">Test {testNumber}</span>
          <h4>{title}</h4>
        </div>
        <span className="method-tag">{method}</span>
      </div>

      <p className="card-desc">{description}</p>

      {configParams.length > 0 && (
        <div className="card-badges">
          {configParams.map((param, idx) => (
            <span key={idx} className="badge-param">
              {param.label}: <strong>{param.value}</strong>
            </span>
          ))}
        </div>
      )}

      <div className="card-footer">
        <span className="endpoint-url" title={endpoint}>
          <code>{endpoint}</code>
        </span>

        <div className="action-buttons">
          <button
            className={`btn ${buttonType}`}
            onClick={onExecute}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                <span>Requesting...</span>
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>{buttonLabel}</span>
              </>
            )}
          </button>

          {allowRetry && onRetry && (
            <button
              className="btn btn-outline"
              onClick={onRetry}
              disabled={isLoading}
              title="Re-run request to test probabilistic behavior"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
              <span>Retry</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
