# 🚨 Autonomous Incident Commander

An AI-powered incident management and monitoring platform designed to automatically monitor infrastructure telemetry, detect anomalies, investigate incidents using AI, and recommend remediation actions.

The system provides a centralized dashboard for monitoring production incidents, telemetry, AI investigation results, incident timelines, and remediation recommendations.
---
## 🌐 Live Demo
### Frontend
🔗 https://incident-commander-frontend.onrender.com/dashboard

### Backend API
🔗 https://incident-commander-backend.onrender.com

### GitHub Repository
🔗 https://github.com/Tejashribambal19/incident-commander
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
8. Displaying incident information through a real-time dashboard

The project is designed as a simulation-first incident management system for demonstrating autonomous incident detection and AI-assisted operations.

---

# ✨ Key Features

## 🔍 Automated Telemetry Monitoring

The backend continuously simulates infrastructure telemetry including:

- CPU usage
- Memory usage
- Latency
- Error rate
- Database connections
- Database connection limits

The monitoring system evaluates these values against predefined thresholds.

---

## 🚨 Anomaly Detection

The system detects anomalies when infrastructure metrics exceed defined thresholds.

Example conditions include:

```text
CPU > 90%
Memory > 90%
Latency > 600 ms
Error Rate > 10%
Database Connections > 90% capacity
