import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const historicalMetrics = {
    "Payment Service Error Spike": [
        { time: "14:20", cpu: 42, latency: 120 },
        { time: "14:22", cpu: 45, latency: 135 },
        { time: "14:24", cpu: 48, latency: 150 },
        { time: "14:26", cpu: 55, latency: 180 },
        { time: "14:28", cpu: 68, latency: 240 },
        { time: "14:30", cpu: 82, latency: 390 },
        { time: "14:32", cpu: 94, latency: 620 },
    ],

    "API Gateway Latency": [
        { time: "14:20", cpu: 40, latency: 180 },
        { time: "14:22", cpu: 42, latency: 220 },
        { time: "14:24", cpu: 45, latency: 280 },
        { time: "14:26", cpu: 48, latency: 350 },
        { time: "14:28", cpu: 52, latency: 470 },
        { time: "14:30", cpu: 55, latency: 590 },
        { time: "14:32", cpu: 60, latency: 720 },
    ],

    "Inventory Database CPU": [
        { time: "14:20", cpu: 55, latency: 160 },
        { time: "14:22", cpu: 62, latency: 180 },
        { time: "14:24", cpu: 70, latency: 210 },
        { time: "14:26", cpu: 78, latency: 250 },
        { time: "14:28", cpu: 85, latency: 290 },
        { time: "14:30", cpu: 91, latency: 330 },
        { time: "14:32", cpu: 97, latency: 390 },
    ],

    "Notification Queue Delay": [
        { time: "14:20", cpu: 38, latency: 110 },
        { time: "14:22", cpu: 44, latency: 130 },
        { time: "14:24", cpu: 50, latency: 160 },
        { time: "14:26", cpu: 57, latency: 190 },
        { time: "14:28", cpu: 62, latency: 230 },
        { time: "14:30", cpu: 68, latency: 280 },
        { time: "14:32", cpu: 72, latency: 320 },
    ],
};

function MetricsPanel({ incident }) {
    if (!incident) {
        return (
            <div className="min-h-[430px] rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-xl font-semibold text-white">
                    System Metrics
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Live infrastructure telemetry
                </p>

                <div className="mt-16 text-center text-slate-500">
                    Select an incident to view system metrics.
                </div>
            </div>
        );
    }

    const telemetry = incident.telemetry || {};

    const cpu = Number(telemetry.cpu ?? 0);
    const memory = Number(telemetry.memory ?? 0);
    const latency = Number(telemetry.latency ?? 0);
    const errorRate = Number(telemetry.errorRate ?? 0);
    const dbConnections = Number(
        telemetry.dbConnections ?? 0
    );
    const dbLimit = Number(
        telemetry.dbConnectionLimit ?? 100
    );

    const dbUsage =
        dbLimit > 0
            ? Math.round(
                  (dbConnections / dbLimit) * 100
              )
            : 0;

    // ------------------------------------------------------------
    // SYSTEM STATUS
    // ------------------------------------------------------------

    let status = "Healthy";
    let statusColor = "text-green-400";
    let statusDot = "bg-green-400";

    if (incident.status === "Resolved") {
        status = "Recovered";
        statusColor = "text-green-400";
        statusDot = "bg-green-400";
    } else if (
        cpu >= 90 ||
        memory >= 90 ||
        latency >= 600 ||
        errorRate >= 10 ||
        dbUsage >= 90
    ) {
        status = "Critical";
        statusColor = "text-red-400";
        statusDot = "bg-red-400";
    } else if (
        cpu >= 75 ||
        memory >= 75 ||
        latency >= 400 ||
        errorRate >= 5 ||
        dbUsage >= 75
    ) {
        status = "Warning";
        statusColor = "text-yellow-400";
        statusDot = "bg-yellow-400";
    }

    // ------------------------------------------------------------
    // CHART
    // ------------------------------------------------------------

    const history =
        historicalMetrics[incident.title] || [];

    const now = new Date();

    const currentTime = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    const chartData = [
        ...history,
        {
            time: currentTime,
            cpu,
            latency,
        },
    ];

    return (
        <div className="min-h-[430px] rounded-2xl border border-slate-800 bg-slate-900 p-6">

            {/* HEADER */}

            <div className="flex items-start justify-between">

                <div>
                    <h2 className="text-xl font-semibold text-white">
                        System Metrics
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        {incident.service}
                    </p>
                </div>

                <div className="flex items-center gap-2">

                    <span
                        className={`h-2 w-2 rounded-full ${statusDot}`}
                    />

                    <span
                        className={`text-xs font-semibold ${statusColor}`}
                    >
                        {status}
                    </span>

                </div>

            </div>

            {/* METRIC CARDS */}

            <div className="mt-5 grid grid-cols-2 gap-3">

                {/* CPU */}

                <div className="rounded-xl bg-slate-950 p-3">

                    <p className="text-xs text-slate-500">
                        CPU Usage
                    </p>

                    <p
                        className={`mt-1 text-xl font-semibold ${
                            cpu >= 90
                                ? "text-red-400"
                                : cpu >= 75
                                ? "text-yellow-400"
                                : "text-green-400"
                        }`}
                    >
                        {cpu}%
                    </p>

                </div>

                {/* MEMORY */}

                <div className="rounded-xl bg-slate-950 p-3">

                    <p className="text-xs text-slate-500">
                        Memory
                    </p>

                    <p
                        className={`mt-1 text-xl font-semibold ${
                            memory >= 90
                                ? "text-red-400"
                                : memory >= 75
                                ? "text-yellow-400"
                                : "text-green-400"
                        }`}
                    >
                        {memory}%
                    </p>

                </div>

                {/* LATENCY */}

                <div className="rounded-xl bg-slate-950 p-3">

                    <p className="text-xs text-slate-500">
                        Latency
                    </p>

                    <p
                        className={`mt-1 text-xl font-semibold ${
                            latency >= 600
                                ? "text-red-400"
                                : latency >= 400
                                ? "text-yellow-400"
                                : "text-green-400"
                        }`}
                    >
                        {latency}ms
                    </p>

                </div>

                {/* ERROR RATE */}

                <div className="rounded-xl bg-slate-950 p-3">

                    <p className="text-xs text-slate-500">
                        Error Rate
                    </p>

                    <p
                        className={`mt-1 text-xl font-semibold ${
                            errorRate >= 10
                                ? "text-red-400"
                                : errorRate >= 5
                                ? "text-yellow-400"
                                : "text-green-400"
                        }`}
                    >
                        {errorRate}%
                    </p>

                </div>

            </div>

            {/* DATABASE */}

            <div className="mt-3 rounded-xl bg-slate-950 p-3">

                <div className="flex items-center justify-between">

                    <div>
                        <p className="text-xs text-slate-500">
                            Database Connections
                        </p>

                        <p className="mt-1 text-lg font-semibold text-white">
                            {dbConnections}/{dbLimit}
                        </p>
                    </div>

                    <p
                        className={`text-sm font-semibold ${
                            dbUsage >= 90
                                ? "text-red-400"
                                : dbUsage >= 75
                                ? "text-yellow-400"
                                : "text-green-400"
                        }`}
                    >
                        {dbUsage}%
                    </p>

                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">

                    <div
                        className={`h-full rounded-full ${
                            dbUsage >= 90
                                ? "bg-red-400"
                                : dbUsage >= 75
                                ? "bg-yellow-400"
                                : "bg-green-400"
                        }`}
                        style={{
                            width: `${Math.min(
                                dbUsage,
                                100
                            )}%`,
                        }}
                    />

                </div>

            </div>

            {/* CHART */}

            <div className="mt-5 h-[150px]">

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
                    <LineChart data={chartData}>

                        <XAxis
                            dataKey="time"
                            tick={{
                                fontSize: 10,
                            }}
                            stroke="#64748b"
                        />

                        <YAxis
                            tick={{
                                fontSize: 10,
                            }}
                            stroke="#64748b"
                        />

                        <Tooltip
                            contentStyle={{
                                backgroundColor:
                                    "#0f172a",
                                border:
                                    "1px solid #334155",
                                borderRadius:
                                    "8px",
                            }}
                        />

                        <Line
                            type="monotone"
                            dataKey="cpu"
                            stroke="#22d3ee"
                            strokeWidth={2}
                            dot={false}
                            name="CPU %"
                        />

                        <Line
                            type="monotone"
                            dataKey="latency"
                            stroke="#facc15"
                            strokeWidth={2}
                            dot={false}
                            name="Latency ms"
                        />

                    </LineChart>
                </ResponsiveContainer>

            </div>

        </div>
    );
}

export default MetricsPanel;