import React, { useState } from 'react';

export default function ResponseInspector({ responseData, isLoading }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!responseData) return;
    const text = typeof responseData.rawBody === 'string'
      ? responseData.rawBody
      : JSON.stringify(responseData.body, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusClass = (status) => {
    if (!status) return '';
    if (status >= 200 && status < 300) return 'status-200';
    if (status >= 400 && status < 500) return 'status-400';
    if (status >= 500) return 'status-500';
    return '';
  };

  const getDiagnostic = () => {
    if (isLoading) {
      return {
        type: 'info',
        text: 'Request is actively executing on the Express server. The express-dev-simulator middleware is calculating timing and probabilistic thresholds...'
      };
    }

    if (!responseData) {
      return {
        type: 'info',
        text: 'Select one of the test scenarios on the left or run a custom simulation to inspect the live response.'
      };
    }

    const { status, endpoint, duration, isSimulatedFailure, isDelayed } = responseData;

    if (isSimulatedFailure) {
      return {
        type: 'warning',
        text: `Simulated Failure Triggered! The express-dev-simulator middleware probabilistically intercepted the request, aborted execution before reaching route handlers, and directly responded with HTTP ${status} ("Simulated failure").`
      };
    }

    if (isDelayed) {
      return {
        type: 'success',
        text: `Artificial Latency Injected! The express-dev-simulator middleware intercepted the request and held it for ${duration}ms before passing execution to the Express route handler.`
      };
    }

    if (endpoint === '/api/normal') {
      return {
        type: 'success',
        text: `Baseline Normal Request. No simulation middleware was applied, achieving immediate sub-millisecond route handling (${duration}ms round-trip).`
      };
    }

    if (status === 200 && endpoint === '/api/failure') {
      return {
        type: 'success',
        text: `Probabilistic Success! The express-dev-simulator failureRate was evaluated (60% chance of error), and this request fell into the 40% survival chance, safely completing.`
      };
    }

    return {
      type: 'info',
      text: `Request completed with HTTP ${status} in ${duration}ms.`
    };
  };

  const diagnostic = getDiagnostic();

  return (
    <div className="inspector-card">
      <div className="inspector-top">
        <div className="inspector-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
          <span>Live Response Inspector</span>
        </div>
        {isLoading && (
          <span className="status-badge status-loading">
            <span className="spinner"></span>
            Awaiting Server
          </span>
        )}
      </div>

      <div className="telemetry-bar">
        <div className="telemetry-item">
          <div className="telemetry-label">Status Code</div>
          <div className="telemetry-value">
            {isLoading ? (
              <span className="status-badge status-loading">...</span>
            ) : responseData ? (
              <span className={`status-badge ${getStatusClass(responseData.status)}`}>
                {responseData.status} {responseData.statusText}
              </span>
            ) : (
              <span style={{ color: '#64748b' }}>--</span>
            )}
          </div>
        </div>

        <div className="telemetry-item">
          <div className="telemetry-label">Measured Latency</div>
          <div className="telemetry-value" style={{ color: responseData?.duration > 800 ? '#38bdf8' : '#10b981' }}>
            {isLoading ? (
              <span className="spinner" style={{ borderColor: 'rgba(56, 189, 248, 0.3)', borderTopColor: '#38bdf8' }}></span>
            ) : responseData ? (
              `${responseData.duration} ms`
            ) : (
              '--'
            )}
          </div>
        </div>

        <div className="telemetry-item">
          <div className="telemetry-label">Target Endpoint</div>
          <div className="telemetry-value" style={{ fontSize: '0.82rem', wordBreak: 'break-all', color: '#cbd5e1' }}>
            {responseData ? (
              <code>{responseData.endpoint}</code>
            ) : (
              '--'
            )}
          </div>
        </div>
      </div>

      <div className={`diagnostic-box ${diagnostic.type}`}>
        {diagnostic.text}
      </div>

      <div className="terminal-viewer">
        <div className="terminal-header">
          <div className="terminal-dots">
            <span className="dot-red"></span>
            <span className="dot-yellow"></span>
            <span className="dot-green"></span>
          </div>
          <span className="terminal-label">HTTP Response Body</span>
          {responseData && (
            <button className="btn-copy" onClick={handleCopy}>
              {copied ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="terminal-body">
          {isLoading ? (
            <div style={{ color: '#38bdf8', padding: '12px 0' }}>
              <span className="spinner" style={{ marginRight: '8px' }}></span>
              Connecting to Express server and awaiting simulated response...
            </div>
          ) : responseData ? (
            <pre>
              {typeof responseData.body === 'object'
                ? JSON.stringify(responseData.body, null, 2)
                : responseData.rawBody}
            </pre>
          ) : (
            <div style={{ color: '#64748b', fontStyle: 'italic', padding: '16px 0', textAlign: 'center' }}>
              No response data yet. Execute any test on the left to see live output.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
