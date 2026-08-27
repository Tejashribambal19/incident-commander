import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import API_URL from "./services/api";

function Incidents() {
  const [incidents, setIncidents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    fetch(`${API_URL}/api/incidents`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch incidents");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Incidents page received:", data);
        setIncidents(data);
      })
      .catch((error) => {
        console.error("Incidents page error:", error);
        setError("Unable to load incidents");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-4xl font-bold">
          Incidents
        </h1>

        <p className="mt-6 text-slate-400">
          Loading incidents...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-4xl font-bold">
          Incidents
        </h1>

        <p className="mt-6 text-red-400">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Incidents
        </h1>

        <p className="mt-3 text-slate-400">
          Monitor and investigate production incidents.
        </p>
      </div>

      <div className="space-y-4">
        {incidents.map((incident) => (
          <div
            key={incident._id}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {incident.title}
                </h2>

                <p className="mt-2 text-slate-400">
                  {incident.description}
                </p>

                <p className="mt-3 text-sm text-slate-500">
                  Service: {incident.service}
                </p>
              </div>

              <div className="text-right">
                <p
                  className={`font-semibold ${
                    incident.status === "Investigating"
                      ? "text-yellow-400"
                      : incident.status === "Active"
                        ? "text-red-400"
                        : "text-green-400"
                  }`}
                >
                  {incident.status}
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  Severity: {incident.severity}
                </p>
              </div>
            </div>

            <div className="mt-5 border-t border-slate-800 pt-4">
              <p className="text-sm text-slate-500">
                ROOT CAUSE
              </p>

              <p className="mt-1 text-slate-300">
                {incident.rootCause}
              </p>
            </div>

            <div className="mt-4">
              <p className="text-sm text-slate-500">
                RECOMMENDED ACTION
              </p>

              <p className="mt-1 text-yellow-400">
                {incident.recommendedAction}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default route */}
        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />

        {/* Incidents */}
        <Route
          path="/incidents"
          element={
            <MainLayout>
              <Incidents />
            </MainLayout>
          }
        />

        {/* Reports */}
        <Route
          path="/reports"
          element={
            <MainLayout>
              <Reports />
            </MainLayout>
          }
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={
            <MainLayout>
              <Settings />
            </MainLayout>
          }
        />

        {/* Unknown routes */}
        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;