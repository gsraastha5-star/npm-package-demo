# Express Dev Simulator Playground

[![npm version](https://img.shields.io/badge/npm-express--dev--simulator%401.0.0-cb3837.svg?style=flat-square&logo=npm)](https://www.npmjs.com/package/express-dev-simulator)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg?style=flat-square&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61dafb.svg?style=flat-square&logo=react)](https://vitejs.dev)
[![Render](https://img.shields.io/badge/Deploy-Render-46E3B7.svg?style=flat-square&logo=render)](https://render.com)

A comprehensive, production-grade developer demonstration playground for the published npm package **[`express-dev-simulator`](https://www.npmjs.com/package/express-dev-simulator)** (version `1.0.0`).

This application demonstrates the genuine middleware imported directly from `node_modules` running inside a conventional Node.js Express backend, coupled with a modern React + Vite developer dashboard.

---

## 🌟 Overview & Purpose

During web development, local APIs typically respond instantaneously (0–5 ms) with 100% reliability. This makes it difficult to test:
- Skeleton loaders, spinners, and pending UI states.
- Network timeouts and error boundary handling.
- Graceful degradation and user retry workflows.

**`express-dev-simulator`** is a lightweight Express.js middleware that simulates real-world network latency and random HTTP failures locally and in testing environments.

This playground allows developers and evaluators to:
1. **Benchmark** a standard immediate Express endpoint.
2. **Experience realistic latency** configured using `minDelay` and `maxDelay`.
3. **Trigger probabilistic errors** configured using `failureRate` and `failureStatus`.
4. **Experiment dynamically** with an interactive simulator lab.
5. **Verify production safety** and the explicit `enabled: true` override.

---

## 🛠️ Technology Stack

- **Backend**: Node.js, Express, `express-dev-simulator` (installed from npm)
- **Frontend**: React, Vite, Modern CSS (Responsive developer tools UI)
- **Deployment**: Render (conventional Express Web Service)

---

## 📁 Project Structure

```
express-dev-simulator-demo/
├── .gitignore               # Git ignore rules (node_modules, dist, logs, etc.)
├── .npmrc                   # ignore-scripts=true for clean installations
├── index.html               # Main HTML entry point for Vite React dashboard
├── package.json             # Root package configuration with build & start scripts
├── README.md                # Project documentation and deployment guide
├── vite.config.mjs          # Vite build and development proxy configuration
├── server/
│   └── index.js             # Express server importing express-dev-simulator middleware
├── src/
│   ├── App.jsx              # Main React dashboard component
│   ├── index.css            # Dark dev-tools styling, glassmorphism, responsive grid
│   ├── main.jsx             # React DOM root render
│   └── components/
│       ├── Header.jsx       # Brand title, version badge, health indicator, npm link
│       ├── Hero.jsx         # Package capabilities, highlights, quick session stats
│       ├── TestCard.jsx     # Reusable test runner card with badges and actions
│       ├── CustomLab.jsx    # Interactive sliders for minDelay, maxDelay, failureRate
│       ├── ResponseInspector.jsx # Real-time latency, HTTP status, and body viewer
│       ├── RequestHistory.jsx    # Chronological request log and benchmark table
│       └── CodeIntegration.jsx   # Live code snippets matching the backend routes
└── test/
    └── api.test.js          # Automated end-to-end verification test suite
```

---

## 📦 How the Published Package is Imported and Used

The application installs and imports the package directly from npm:

```bash
npm install express-dev-simulator
```

### Import Statement
In `server/index.js`:
```javascript
const { simulator } = require('express-dev-simulator');
```

### Middleware Integration Examples

#### 1. Artificial Latency Simulation Route
```javascript
app.get(
  '/api/delayed',
  simulator({
    enabled: true,         // Explicit override ensuring active state in production
    minDelay: 1200,        // Minimum latency (ms)
    maxDelay: 2000,        // Maximum latency (ms)
    failureRate: 0,        // 0% failure
    failureStatus: 500
  }),
  (req, res) => {
    res.json({
      status: 'success',
      type: 'delayed',
      message: 'Delayed response completed successfully via express-dev-simulator'
    });
  }
);
```

#### 2. Probabilistic Failure Simulation Route
```javascript
app.get(
  '/api/failure',
  simulator({
    enabled: true,
    minDelay: 300,
    maxDelay: 600,
    failureRate: 0.6,      // 60% probability of request failure
    failureStatus: 503     // Injects HTTP 503 Service Unavailable
  }),
  (req, res) => {
    // Surviving requests (40% probability) reach this handler:
    res.json({
      status: 'success',
      type: 'failure_simulation',
      message: 'Request survived the probabilistic failure threshold!'
    });
  }
);
```

#### 3. Production Safety Mechanism
The `express-dev-simulator` package automatically disables itself if `process.env.NODE_ENV === 'production'` unless `enabled: true` is explicitly provided. In our demonstration server, we explicitly set `enabled: true` on the demo endpoints so they function properly when hosted on Render while preserving production safety for real services.

---

## 🚀 Running Locally

### Prerequisites
- Node.js version 18.x or higher
- npm version 9.x or higher

### Installation & Run Steps

1. **Clone or navigate to the project directory**:
   ```bash
   cd express-dev-simulator-demo
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   *(Note: The included `.npmrc` sets `ignore-scripts=true` to ensure clean installations across all environments).*

3. **Build the frontend**:
   ```bash
   npm run build
   ```

4. **Start the unified server**:
   ```bash
   npm start
   ```

5. **Open in browser**:
   Navigate to [http://localhost:3001](http://localhost:3001)

### Development Mode (with Live Reloading)
To run frontend and backend simultaneously with Vite hot-module replacement:
- Terminal 1 (Backend API):
  ```bash
  npm run dev
  ```
- Terminal 2 (Vite Client Dev Server):
  ```bash
  npm run dev:client
  ```
  Navigate to [http://localhost:3000](http://localhost:3000) (requests to `/api` and `/health` automatically proxy to port 3001).

---

## 🧪 Automated Verification & Testing

To execute the automated end-to-end verification test suite:

```bash
npm test
```

The test suite validates:
1. Direct import of `{ simulator }` from `express-dev-simulator`.
2. `/health` endpoint accessibility.
3. `/api/normal` immediate baseline response ($< 50\text{ ms}$).
4. `/api/delayed` execution verifying measured latency is within the configured $1200\text{ ms} - 2000\text{ ms}$ window.
5. `/api/failure` probabilistic interception verifying HTTP 503 status and `"Simulated failure"` body.
6. `POST /api/simulate` dynamic parameter validation and execution.
7. Static React bundle serving on `GET /`.

---

## 📤 Pushing to a New Public GitHub Repository

Follow these steps to publish this project to a new repository named `express-dev-simulator-demo`:

1. **Initialize a Git repository locally**:
   ```bash
   git init
   git branch -M main
   ```

2. **Add all files and create the initial commit**:
   ```bash
   git add .
   git commit -m "feat: complete express-dev-simulator developer playground demo"
   ```

3. **Create the new repository on GitHub**:
   - Go to [GitHub: Create a New Repository](https://github.com/new).
   - Set the repository name to: `express-dev-simulator-demo`.
   - Set visibility to **Public**.
   - Do **NOT** check "Add a README", ".gitignore", or "license" (these are already configured locally).
   - Click **Create repository**.

4. **Link the remote and push**:
   ```bash
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/express-dev-simulator-demo.git
   git push -u origin main
   ```

---

## 🌐 Deploying on Render (Step-by-Step)

This application is ready to deploy on **[Render](https://render.com)** as a Node.js Web Service.

### Step 1: Create a New Web Service on Render
1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** in the top navigation and select **Web Service**.
3. Under **Connect a repository**, select your newly pushed GitHub repository: `express-dev-simulator-demo`.

### Step 2: Configure Service Settings
Fill in the configuration details:

| Setting | Value |
| :--- | :--- |
| **Name** | `express-dev-simulator-demo` (or preferred name) |
| **Region** | Select region closest to you (e.g. Oregon, Frankfurt, Singapore) |
| **Branch** | `main` |
| **Root Directory** | *(leave blank - project root)* |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` (or standard tier) |

### Step 3: Environment Variables
No custom secrets are required. Render automatically supplies:
- `PORT`: Automatically provided by Render; our Express server binds dynamically via `process.env.PORT || 3001` on `0.0.0.0`.
- `NODE_ENV`: Defaults to `production`. *(Our backend routes explicitly set `enabled: true` in the simulator middleware so the demonstration functions seamlessly in production).*

### Step 4: Health Check (Optional but Recommended)
- Expand **Advanced Settings**.
- Set **Health Check Path** to: `/health`.

### Step 5: Deploy
1. Click **Deploy Web Service**.
2. Render will run `npm install && npm run build` and then start the server with `npm start`.
3. Once the build completes, Render will provide your public URL (e.g., `https://express-dev-simulator-demo.onrender.com`).
4. Open the URL to interact with the live playground!

---

## 📄 License

MIT &copy; 2026. Built to showcase the **[`express-dev-simulator`](https://www.npmjs.com/package/express-dev-simulator)** npm package.
