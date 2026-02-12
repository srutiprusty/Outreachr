import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-gray-100 overflow-x-hidden h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar />

        {/* IMPORTANT: min-w-0 + overflow-y-auto */}
        <main className="flex-1 overflow-y-auto min-w-0 h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
