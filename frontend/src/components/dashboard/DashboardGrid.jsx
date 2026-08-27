import IncidentList from "../incidents/IncidentList";
import TimelinePanel from "../timeline/TimelinePanel";
import MetricsPanel from "../metrics/MetricsPanel";
import AIInvestigationPanel from "./AIInvestigationPanel";

function DashboardGrid({
    selectedIncident,
    setSelectedIncident,
    onApproveFix,
}) {
    return (
        <div className="mt-8 w-full min-w-0 space-y-6">

            {/* ================================================= */}
            {/* TOP ROW */}
            {/* ================================================= */}

            <div className="grid w-full min-w-0 grid-cols-1 gap-6 xl:grid-cols-12">

                {/* INCIDENTS */}

                <div className="min-w-0 xl:col-span-8">
                    <IncidentList
                        selectedIncident={
                            selectedIncident
                        }
                        setSelectedIncident={
                            setSelectedIncident
                        }
                    />
                </div>

                {/* AI INVESTIGATION */}

                <div className="min-w-0 xl:col-span-4">
                    <AIInvestigationPanel
                        incident={selectedIncident}
                        onApproveFix={
                            onApproveFix
                        }
                    />
                </div>

            </div>

            {/* ================================================= */}
            {/* BOTTOM ROW */}
            {/* ================================================= */}

            <div className="grid w-full min-w-0 grid-cols-1 gap-6 xl:grid-cols-12">

                {/* TIMELINE */}

                <div className="min-w-0 xl:col-span-8">
                    <TimelinePanel
                        incident={selectedIncident}
                    />
                </div>

                {/* METRICS */}

                <div className="min-w-0 xl:col-span-4">
                    <MetricsPanel
                        incident={selectedIncident}
                    />
                </div>

            </div>

        </div>
    );
}

export default DashboardGrid;