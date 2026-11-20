import React from 'react';

export default function RequestHistory({ history, onClear }) {
  return (
    <div className="history-section">
      <div className="section-header">
        <h3>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          Request History & Benchmark Telemetry ({history.length})
        </h3>
        {history.length > 0 && (
          <button className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={onClear}>
            Clear History
          </button>
        )}
      </div>

      <div className="history-table-wrapper">
        {history.length === 0 ? (
          <div className="empty-history">
            No requests executed yet. Run tests above to record live telemetry logs.
          </div>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Method</th>
                <th>Endpoint</th>
                <th>Status</th>
                <th>Measured Latency</th>
                <th>Outcome</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94a3b8' }}>
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </td>
                  <td>
                    <span className="method-tag" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                      {item.method}
                    </span>
                  </td>
                  <td>
                    <code style={{ color: '#e2e8f0' }}>{item.endpoint}</code>
                  </td>
                  <td>
                    <span
                      className="status-badge"
                      style={{
                        fontSize: '0.74rem',
                        padding: '2px 8px',
                        background: item.status === 200 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                        color: item.status === 200 ? '#10b981' : '#f43f5e',
                        border: `1px solid ${item.status === 200 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)'}`
                      }}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '600' }}>
                    {item.duration} ms
                  </td>
                  <td style={{ fontSize: '0.8rem', color: item.isSimulatedFailure ? '#f43f5e' : '#cbd5e1' }}>
                    {item.summary}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
