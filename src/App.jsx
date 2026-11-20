import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import TestCard from './components/TestCard';
import CustomLab from './components/CustomLab';
import ResponseInspector from './components/ResponseInspector';
import RequestHistory from './components/RequestHistory';
import CodeIntegration from './components/CodeIntegration';

export default function App() {
  const [serverHealth, setServerHealth] = useState(null);
  const [activeTest, setActiveTest] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({
    totalCalls: 0,
    successes: 0,
    failures: 0,
    lastLatency: null
  });

  // Fetch initial health check from Express backend
  useEffect(() => {
    fetch('/health')
      .then((res) => res.json())
      .then((data) => setServerHealth(data))
      .catch((err) => console.warn('Could not reach /health endpoint yet:', err));
  }, []);

  const handleRequest = async (testType, customConfig = null) => {
    setActiveTest(testType);
    setIsLoading(true);

    let endpoint = '/api/normal';
    let method = 'GET';
    let bodyPayload = undefined;

    if (testType === 'normal') {
      endpoint = '/api/normal';
    } else if (testType === 'delayed') {
      endpoint = '/api/delayed';
    } else if (testType === 'failure') {
      endpoint = '/api/failure';
    } else if (testType === 'custom') {
      endpoint = '/api/simulate';
      method = 'POST';
      bodyPayload = JSON.stringify(customConfig);
    }

    const startTime = performance.now();

    try {
      const response = await fetch(endpoint, {
        method,
        headers: bodyPayload ? { 'Content-Type': 'application/json' } : undefined,
        body: bodyPayload
      });

      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      const contentType = response.headers.get('content-type') || '';
      let parsedBody = null;
      let rawText = '';

      if (contentType.includes('application/json')) {
        parsedBody = await response.json();
        rawText = JSON.stringify(parsedBody, null, 2);
      } else {
        rawText = await response.text();
        parsedBody = rawText;
      }

      const isSimulatedFailure = response.status >= 400 && rawText.includes('Simulated failure');
      const isSuccess = response.status >= 200 && response.status < 300;
      const isDelayed = duration >= 800 || (testType === 'delayed');

      let summary = '';
      if (isSimulatedFailure) {
        summary = `Simulated ${response.status} failure triggered`;
      } else if (isDelayed) {
        summary = `Delayed completed (${duration}ms)`;
      } else if (isSuccess) {
        summary = `Success (${duration}ms)`;
      } else {
        summary = `HTTP ${response.status} returned`;
      }

      const resultObj = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        method,
        endpoint,
        status: response.status,
        statusText: response.statusText || (response.status === 200 ? 'OK' : 'Error'),
        duration,
        body: parsedBody,
        rawBody: rawText,
        isSimulatedFailure,
        isDelayed,
        summary
      };

      setResponseData(resultObj);
      setHistory((prev) => [resultObj, ...prev.slice(0, 49)]);

      setStats((prev) => ({
        totalCalls: prev.totalCalls + 1,
        successes: isSuccess ? prev.successes + 1 : prev.successes,
        failures: !isSuccess ? prev.failures + 1 : prev.failures,
        lastLatency: duration
      }));

    } catch (err) {
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      const errorObj = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        method,
        endpoint,
        status: 0,
        statusText: 'Network / Client Error',
        duration,
        body: { error: err.message },
        rawBody: `Network error: ${err.message}`,
        isSimulatedFailure: false,
        isDelayed: false,
        summary: `Network error: ${err.message}`
      };

      setResponseData(errorObj);
      setHistory((prev) => [errorObj, ...prev.slice(0, 49)]);
      setStats((prev) => ({
        totalCalls: prev.totalCalls + 1,
        successes: prev.successes,
        failures: prev.failures + 1,
        lastLatency: duration
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Header serverHealth={serverHealth} />
      <Hero stats={stats} />

      <div className="dashboard-grid">
        {/* Left Column: Test Scenarios */}
        <div className="tests-column">
          <div className="section-header">
            <h3>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
              Simulation Test Scenarios
            </h3>
            <span className="badge-param">Live Express Endpoints</span>
          </div>

          <div className="cards-container">
            {/* Test 1: Normal API */}
            <TestCard
              testNumber="1"
              title="Normal Baseline API"
              endpoint="/api/normal"
              description="Standard Express route with 0 artificial delay and 0% failure probability. Serves as our latency and status code baseline."
              configParams={[
                { label: 'Latency', value: '0ms' },
                { label: 'Failure Rate', value: '0%' },
                { label: 'Expected Status', value: '200 OK' }
              ]}
              buttonLabel="Send Normal Request"
              buttonType="btn-emerald"
              isActive={activeTest === 'normal'}
              isLoading={isLoading && activeTest === 'normal'}
              onExecute={() => handleRequest('normal')}
            />

            {/* Test 2: Latency Simulation */}
            <TestCard
              testNumber="2"
              title="Artificial Delay Simulation"
              endpoint="/api/delayed"
              description="Genuine express-dev-simulator middleware applied to simulate high network latency (e.g. slow 3G or cross-region database queries)."
              configParams={[
                { label: 'minDelay', value: '1200ms' },
                { label: 'maxDelay', value: '2000ms' },
                { label: 'failureRate', value: '0%' }
              ]}
              buttonLabel="Send Delayed Request"
              buttonType="btn-primary"
              isActive={activeTest === 'delayed'}
              isLoading={isLoading && activeTest === 'delayed'}
              onExecute={() => handleRequest('delayed')}
            />

            {/* Test 3: Failure Simulation */}
            <TestCard
              testNumber="3"
              title="Probabilistic Failure Simulation"
              endpoint="/api/failure"
              description="Applies express-dev-simulator configured with a 60% failure rate. Injects HTTP 503 errors probabilistically to test UI resilience and retry logic."
              configParams={[
                { label: 'failureRate', value: '0.6 (60%)' },
                { label: 'failureStatus', value: '503' },
                { label: 'minDelay', value: '300ms' },
                { label: 'maxDelay', value: '600ms' }
              ]}
              buttonLabel="Test Failure Simulation"
              buttonType="btn-amber"
              allowRetry={true}
              isActive={activeTest === 'failure'}
              isLoading={isLoading && activeTest === 'failure'}
              onExecute={() => handleRequest('failure')}
              onRetry={() => handleRequest('failure')}
            />

            {/* Test 4: Custom Simulator Lab */}
            <CustomLab
              isActive={activeTest === 'custom'}
              isLoading={isLoading && activeTest === 'custom'}
              onExecute={(customConfig) => handleRequest('custom', customConfig)}
            />
          </div>
        </div>

        {/* Right Column: Response Inspector */}
        <div className="inspector-column">
          <ResponseInspector
            responseData={responseData}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* History Log */}
      <RequestHistory
        history={history}
        onClear={() => setHistory([])}
      />

      {/* Code Integration Section */}
      <CodeIntegration />

      {/* Footer */}
      <footer className="app-footer">
        <div>
          <strong>Express Dev Simulator Playground</strong> &bull; Demonstrating published npm package <code>express-dev-simulator@1.0.0</code>
        </div>
        <div className="footer-links">
          <a href="https://www.npmjs.com/package/express-dev-simulator" target="_blank" rel="noopener noreferrer">
            npm Registry
          </a>
          <span>&bull;</span>
          <span>MIT License</span>
        </div>
      </footer>
    </div>
  );
}
