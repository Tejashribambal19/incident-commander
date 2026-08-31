# 🚨 Autonomous Incident Commander

An AI-powered incident management and monitoring platform designed to monitor infrastructure telemetry, detect anomalies, investigate incidents using AI, identify probable root causes, and recommend remediation actions.

The system provides a centralized dashboard for monitoring production incidents, telemetry, AI investigation results, incident timelines, system metrics, and remediation recommendations.

---

## 🌐 Live Demo

### Frontend

https://incident-commander-frontend.onrender.com/dashboard

### Backend API

https://incident-commander-backend.onrender.com

### GitHub Repository

https://github.com/Tejashribambal19/incident-commander

---

## 📌 Project Overview

Modern software systems generate large amounts of infrastructure telemetry such as CPU usage, memory utilization, latency, error rates, and database connection usage.

Manually monitoring these metrics can delay incident detection and resolution.

The **Autonomous Incident Commander** automates this process by:

1. Monitoring infrastructure telemetry
2. Detecting abnormal conditions
3. Creating and tracking incidents
4. Investigating incidents using AI
5. Identifying probable root causes
6. Generating remediation recommendations
7. Recording investigation events
8. Displaying incident information through a centralized dashboard

The project follows a simulation-first approach to demonstrate automated incident detection and AI-assisted incident operations.

---

# ✨ Key Features

## 🔍 Automated Telemetry Monitoring

The backend simulates infrastructure telemetry including:

- CPU usage
- Memory utilization
- Latency
- Error rate
- Database connections
- Database connection limits

The monitoring system evaluates these values against predefined thresholds.

---

## 🚨 Anomaly Detection

The system detects anomalies when infrastructure metrics exceed defined thresholds.

Current anomaly conditions include:

```text
CPU > 90%
Memory > 90%
Latency > 600 ms
Error Rate > 10%
Database Connections > 90% capacity
```

When abnormal telemetry is detected, the corresponding incident is processed by the monitoring workflow.

---

## 🤖 AI Incident Investigation

When an incident requires investigation, the system uses AI-assisted analysis based on the available incident telemetry and deployment information.

The AI investigation provides:

- Probable root cause
- Confidence score
- Recommended remediation action

Example:

```text
Incident:
Payment Service Error Spike

Root Cause:
Payment Service v2.3.1 introduced a database connection failure.

Confidence:
94%

Recommended Action:
Rollback deployment v2.3.1
```

---

## 🧠 Incident Lifecycle

The system supports the following incident states:

```text
Investigating
Active
Resolved
```

This allows incidents to be tracked throughout their operational lifecycle.

---

## 📊 Monitoring Dashboard

The frontend provides a centralized operational dashboard containing:

- Total incidents
- Active incidents
- Critical incidents
- Resolved incidents
- Incident details
- Telemetry metrics
- AI investigation results
- Root-cause information
- Recommended remediation
- Incident timeline
- System metrics
- Incident status

---

## 📜 Incident Timeline

The system records important events associated with each incident.

Example event types include:

```text
INCIDENT_DETECTED
AI_INVESTIGATION_STARTED
ROOT_CAUSE_IDENTIFIED
REMEDIATION_RECOMMENDED
```

These events provide a history of the incident investigation process.

---

## 🔧 Simulated Fault Injection

The project includes a simulated fault-injection mechanism for testing incident detection and monitoring.

Example endpoint:

```http
POST /api/telemetry/inject-fault
```

Example request:

```json
{
  "type": "payment"
}
```

A simulated payment-service fault can generate abnormal telemetry such as:

```text
High latency
High error rate
High database connections
```

The monitoring system can then detect the anomaly and process it through the incident investigation workflow.

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────────┐
                    │      React Frontend     │
                    │      Vite + React       │
                    │      Tailwind CSS        │
                    └────────────┬────────────┘
                                 │
                                 │ REST API
                                 ▼
                    ┌─────────────────────────┐
                    │      Node.js Backend    │
                    │        Express.js       │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
       ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
       │   Telemetry  │   │      AI      │   │    Events    │
       │   Monitoring │   │ Investigation│   │   Timeline   │
       └──────┬───────┘   └──────┬───────┘   └──────┬───────┘
              │                  │                  │
              └──────────────────┼──────────────────┘
                                 │
                                 ▼
                       ┌────────────────────┐
                       │      MongoDB       │
                       │    Data Storage    │
                       └────────────────────┘
```

---

# 🔄 Incident Detection Workflow

```text
Infrastructure Telemetry
          │
          ▼
Telemetry Simulation
          │
          ▼
Threshold Evaluation
          │
          ▼
Anomaly Detection
          │
          ▼
Incident Detection
          │
          ▼
AI Investigation
          │
          ├──────────► Root Cause
          │
          ├──────────► Confidence Score
          │
          └──────────► Recommended Action
                              │
                              ▼
                     Timeline Event
                              │
                              ▼
                     Incident Dashboard
                              │
                              ▼
                       Operator Review
```

---

# 🛠️ Technology Stack

## Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- Axios
- React Router

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- REST APIs
- Socket.IO

## Artificial Intelligence

- OpenAI API
- AI-assisted incident investigation
- Root-cause analysis
- Confidence scoring
- Remediation recommendations

## Database

- MongoDB Atlas

## Development and Deployment

- Git
- GitHub
- Render

---

# 📁 Project Structure

```text
incident-commander/
│
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── Incident.js
│   │   │   └── Event.js
│   │   │
│   │   ├── routes/
│   │   │   ├── incidents.js
│   │   │   ├── telemetry.js
│   │   │   ├── events.js
│   │   │   ├── ai.js
│   │   │   └── remediation.js
│   │   │
│   │   ├── simulator/
│   │   │   └── injectIncident.js
│   │   │
│   │   └── server.js
│   │
│   ├── seed.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── data/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

# 🔌 API Endpoints

## Incidents

### Get All Incidents

```http
GET /api/incidents
```

Returns the incidents stored in the database.

---

## Telemetry

### Simulate Telemetry

```http
POST /api/telemetry/simulate
```

Simulates infrastructure telemetry and updates incident telemetry data.

### Check Telemetry

```http
POST /api/telemetry/check
```

Checks current telemetry against anomaly thresholds.

### Automatic Monitoring

```http
POST /api/telemetry/monitor
```

Runs the automatic telemetry monitoring process and detects anomalies.

### Inject Fault

```http
POST /api/telemetry/inject-fault
```

Example:

```json
{
  "type": "payment"
}
```

Injects a simulated fault for testing the incident monitoring workflow.

---

## Events

### Get Incident Events

```http
GET /api/events/:incidentId
```

Returns the timeline events associated with a specific incident.

Example:

```text
/api/events/6a906e34d3e940134c4790a2
```

---

# 🧪 Testing the Incident Detection System

A payment-service fault can be injected using:

```powershell
Invoke-RestMethod `
  -Method POST `
  http://localhost:5000/api/telemetry/inject-fault `
  -ContentType "application/json" `
  -Body '{"type":"payment"}'
```

The telemetry can then be checked using:

```powershell
Invoke-RestMethod `
  -Method POST `
  http://localhost:5000/api/telemetry/check
```

Automatic monitoring can be triggered using:

```powershell
Invoke-RestMethod `
  -Method POST `
  http://localhost:5000/api/telemetry/monitor
```

Incident timeline events can be retrieved using:

```powershell
Invoke-RestMethod `
  "http://localhost:5000/api/events/6a906e34d3e940134c4790a2"
```

---

# 🧪 Example Detected Incident

## Payment Service Error Spike

Example incident:

```text
Service:
Payment Service

Severity:
Critical

Status:
Investigating
```

Example abnormal telemetry:

```text
Latency: 852 ms
Error Rate: 18%
Database Connections: 96/100
```

Detected reasons can include:

```text
Latency exceeds threshold of 600 ms
Error rate exceeds threshold of 10%
Database connections exceed 90% capacity
```

Example AI investigation:

```text
Root Cause:
Payment Service v2.3.1 introduced a database connection failure.

Confidence:
94%

Recommended Action:
Rollback deployment v2.3.1
```

---

# 📈 Monitoring Flow

```text
Simulated Fault
      │
      ▼
Telemetry Updated
      │
      ▼
Threshold Evaluation
      │
      ▼
Anomaly Detected
      │
      ▼
Incident Created / Updated
      │
      ▼
AI Investigation
      │
      ├──► Root Cause
      ├──► Confidence
      └──► Recommended Action
      │
      ▼
Timeline Event Recorded
      │
      ▼
Dashboard Updated
      │
      ▼
Operator Review
```

---

# 🗄️ Database Design

The application uses MongoDB Atlas for persistent storage.

## Incident Collection

The Incident model contains:

- Title
- Service
- Severity
- Status
- Description
- Root cause
- Confidence
- Recommended action
- Telemetry
- Deployment information
- Timestamp
- Created timestamp
- Updated timestamp

## Event Collection

The Event model contains:

- Incident ID
- Event type
- Event message
- Timestamp
- Created timestamp
- Updated timestamp

---

# 🚀 Running Locally

## 1. Clone the Repository

```bash
git clone https://github.com/Tejashribambal19/incident-commander.git
cd incident-commander
```

---

## 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
PORT=5000
```

Start the backend:

```bash
node src/server.js
```

Backend:

```text
http://localhost:5000
```

---

## 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file if required:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🌍 Deployment

The application is deployed using Render.

### Frontend

https://incident-commander-frontend.onrender.com/dashboard

### Backend

https://incident-commander-backend.onrender.com

### Database

MongoDB Atlas

---

# 🔐 Security

Sensitive configuration values must never be committed to GitHub.

Do not commit:

```text
.env
API keys
Database passwords
Access tokens
Private credentials
```

Environment variables should be used for sensitive configuration.

The `.gitignore` file should prevent sensitive files from being committed.

---

# 🎯 Project Objectives

The main objectives of Autonomous Incident Commander are:

- Automate infrastructure monitoring
- Detect abnormal infrastructure conditions
- Detect incidents automatically
- Reduce manual incident investigation
- Use AI for root-cause analysis
- Generate remediation recommendations
- Maintain an incident timeline
- Provide centralized operational visibility
- Provide a simulation environment for testing incident response
- Demonstrate an AI-assisted incident management workflow

---

# 📊 Project Status

| Component | Status |
|---|---|
| React Frontend | ✅ Deployed |
| Node.js Backend | ✅ Deployed |
| MongoDB Atlas | ✅ Connected |
| Telemetry Simulation | ✅ Working |
| Fault Injection | ✅ Working |
| Anomaly Detection | ✅ Working |
| AI Investigation | ✅ Working |
| Incident Timeline | ✅ Working |
| System Metrics | ✅ Working |
| Incident Dashboard | ✅ Working |
| GitHub Repository | ✅ Updated |
| Render Deployment | ✅ Active |

---

# 🚀 Future Enhancements

Potential future improvements include:

- Real infrastructure telemetry integration
- Advanced anomaly detection
- More AI investigation strategies
- Automated remediation execution with authorization
- Notification integrations
- Role-based access control
- Incident prioritization
- Advanced incident analytics
- Historical incident analysis
- Production monitoring integrations

---

# 👩‍💻 Project

## Autonomous Incident Commander

An AI-powered incident detection, investigation, monitoring, and remediation recommendation platform designed to demonstrate an automated incident-management workflow.

---

# 🔗 Links

### GitHub Repository

https://github.com/Tejashribambal19/incident-commander

### Live Frontend

https://incident-commander-frontend.onrender.com/dashboard

### Backend API

https://incident-commander-backend.onrender.com