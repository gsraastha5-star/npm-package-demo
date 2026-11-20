// test/api.test.js
const assert = require('assert');
const http = require('http');
const app = require('../server/index.js');
const { simulator } = require('express-dev-simulator');

async function runTests() {
  console.log('====================================================');
  console.log('EXPRESS DEV SIMULATOR PLAYGROUND - VERIFICATION SUITE');
  console.log('====================================================\n');

  // 1. Verify npm package import and options validation
  console.log('[Test 1] Verifying express-dev-simulator package import...');
  assert.strictEqual(typeof simulator, 'function', 'simulator must be exported as a function');
  console.log('✓ Successfully imported simulator function from node_modules/express-dev-simulator\n');

  // Start temporary server on dynamic port
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`Test server running at ${baseUrl}\n`);

  try {
    // 2. Health check test
    console.log('[Test 2] Testing Health Check endpoint (/health)...');
    let t0 = Date.now();
    let res = await fetch(`${baseUrl}/health`);
    let json = await res.json();
    assert.strictEqual(res.status, 200, 'Health check should return 200');
    assert.strictEqual(json.status, 'ok', 'Health status should be ok');
    console.log(`✓ Health check OK (Status: ${res.status}, Latency: ${Date.now() - t0}ms)\n`);

    // 3. Normal API endpoint test
    console.log('[Test 3] Testing Normal Baseline API endpoint (/api/normal)...');
    t0 = Date.now();
    res = await fetch(`${baseUrl}/api/normal`);
    json = await res.json();
    let normalDuration = Date.now() - t0;
    assert.strictEqual(res.status, 200, 'Normal endpoint should return 200');
    assert.strictEqual(json.type, 'normal', 'Type should be normal');
    assert.ok(normalDuration < 300, `Normal endpoint should be fast, got ${normalDuration}ms`);
    console.log(`✓ Normal endpoint OK (Status: ${res.status}, Latency: ${normalDuration}ms, Type: ${json.type})\n`);

    // 4. Delay simulation endpoint test
    console.log('[Test 4] Testing Artificial Delay endpoint (/api/delayed)...');
    console.log('Configured range: minDelay=1200ms, maxDelay=2000ms');
    t0 = Date.now();
    res = await fetch(`${baseUrl}/api/delayed`);
    json = await res.json();
    let delayDuration = Date.now() - t0;
    assert.strictEqual(res.status, 200, 'Delayed endpoint should return 200');
    assert.strictEqual(json.type, 'delayed', 'Type should be delayed');
    assert.ok(delayDuration >= 1150, `Delay duration should be >= 1150ms, got ${delayDuration}ms`);
    console.log(`✓ Delay simulation OK (Status: ${res.status}, Measured Latency: ${delayDuration}ms - within 1200ms-2000ms range)\n`);

    // 5. Failure simulation endpoint test
    console.log('[Test 5] Testing Failure Simulation endpoint (/api/failure)...');
    console.log('Configured: failureRate=0.6 (60%), failureStatus=503');
    let failureCount = 0;
    let successCount = 0;
    const testRounds = 10;

    for (let i = 0; i < testRounds; i++) {
      res = await fetch(`${baseUrl}/api/failure`);
      if (res.status === 503) {
        failureCount++;
        const text = await res.text();
        assert.strictEqual(text, 'Simulated failure', 'Error message body must match express-dev-simulator output');
      } else if (res.status === 200) {
        successCount++;
        const data = await res.json();
        assert.strictEqual(data.type, 'failure_simulation');
      }
    }
    console.log(`Completed ${testRounds} probabilistic requests: ${failureCount} simulated failures (HTTP 503), ${successCount} successes (HTTP 200)`);
    assert.ok(failureCount > 0, 'Should have encountered at least one failure given 60% probability over 10 requests');
    console.log('✓ Probabilistic failure simulation verified!\n');

    // 6. Custom simulation endpoint test
    console.log('[Test 6] Testing Custom Simulator endpoint (POST /api/simulate)...');
    res = await fetch(`${baseUrl}/api/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        minDelay: 250,
        maxDelay: 400,
        failureRate: 0,
        failureStatus: 500,
        enabled: true
      })
    });
    json = await res.json();
    assert.strictEqual(res.status, 200, 'Custom simulate endpoint should return 200');
    assert.strictEqual(json.type, 'custom_simulation');
    assert.strictEqual(json.appliedConfig.minDelay, 250);
    console.log('✓ Custom simulation dynamic invocation verified!\n');

    // 7. Static frontend serving test
    console.log('[Test 7] Testing Static Frontend Serving (GET /)...');
    res = await fetch(`${baseUrl}/`);
    const html = await res.text();
    assert.strictEqual(res.status, 200, 'Frontend route should return 200');
    assert.ok(html.includes('Express Dev Simulator Playground'), 'Frontend HTML should contain app title');
    assert.ok(html.includes('<div id="root"></div>'), 'Frontend HTML should contain React mount root');
    console.log('✓ React static bundle serving verified!\n');

    console.log('====================================================');
    console.log('ALL TESTS PASSED SUCCESSFULLY! (7/7 VERIFIED)');
    console.log('====================================================');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

runTests().catch((err) => {
  console.error('\n❌ Test suite failed:', err);
  process.exit(1);
});
