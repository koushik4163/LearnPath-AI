import Sidebar from './Sidebar';

export default function AppLayout({ children }) {
  return (
    <div className="app-shell min-h-screen">
      <div className="w-full max-w-[1640px] pl-8 pr-0 pt-0 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] lg:grid-cols-[280px_1fr] gap-6">
          <Sidebar />
          <main className="min-w-0 pt-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
