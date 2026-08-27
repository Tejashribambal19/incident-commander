import Sidebar from "../components/layout/Sidebar";
import TopNavbar from "../components/layout/TopNavbar";

function MainLayout({
    children,
    activePage,
    setActivePage,
}) {
    return (
        <div className="flex h-screen w-full min-w-0 overflow-hidden bg-slate-950 text-white">

            {/* ================================================== */}
            {/* SIDEBAR */}
            {/* ================================================== */}

            <aside className="shrink-0">
                <Sidebar
                    activePage={activePage}
                    setActivePage={setActivePage}
                />
            </aside>

            {/* ================================================== */}
            {/* MAIN APPLICATION */}
            {/* ================================================== */}

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

                {/* TOP NAVBAR */}

                <div className="shrink-0">
                    <TopNavbar />
                </div>

                {/* ================================================== */}
                {/* PAGE CONTENT */}
                {/* ================================================== */}

                <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-slate-900">

                    <div className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-6 lg:px-8 xl:px-10">

                        {children}

                    </div>

                </main>

            </div>

        </div>
    );
}

export default MainLayout;