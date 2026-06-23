import { Breadcrumb } from "../components/Breadcrumb/Breadcrumb";

export default function Home() {
  return (
    <div className="flex flex-col space-y-4">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to Canonical Design System.</p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="bg-white overflow-hidden shadow-sm rounded-xl border border-border p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <h3 className="text-lg font-medium text-gray-600">Metric {item}</h3>
            <p className="mt-2 text-3xl font-semibold text-primary">1,024</p>
          </div>
        ))}
      </div>
      
      {/* Example content to test scrollbar hiding */}
      <div className="mt-8 h-96 bg-gray-50 rounded-xl border border-border p-6 border-dashed flex items-center justify-center text-gray-400">
        Scrollable area placeholder
      </div>
      <div className="mt-8 h-96 bg-gray-50 rounded-xl border border-border p-6 border-dashed flex items-center justify-center text-gray-400">
        Scrollable area placeholder 2
      </div>
    </div>
  );
}
