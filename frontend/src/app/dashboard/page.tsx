export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-slate-400 mt-1">Overview of system operations and recent activities.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Cases</p>
              <h3 className="text-3xl font-bold text-white mt-2">1,248</h3>
            </div>
            <div className="h-10 w-10 bg-blue-900/50 rounded-full flex items-center justify-center text-blue-500 text-xl">
              📁
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-emerald-500 font-medium flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
              12%
            </span>
            <span className="text-slate-500 ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400">Verified Documents</p>
              <h3 className="text-3xl font-bold text-white mt-2">8,932</h3>
            </div>
            <div className="h-10 w-10 bg-purple-900/50 rounded-full flex items-center justify-center text-purple-500 text-xl">
              📄
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-emerald-500 font-medium flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
              4%
            </span>
            <span className="text-slate-500 ml-2">from last month</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-red-900/30 rounded-lg p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-red-500 text-6xl">🛡️</div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-400">Security Alerts</p>
              <h3 className="text-3xl font-bold text-red-400 mt-2">3</h3>
            </div>
            <div className="h-10 w-10 bg-red-900/50 rounded-full flex items-center justify-center text-red-500 text-xl">
              🚨
            </div>
          </div>
          <div className="relative z-10 mt-4 flex items-center text-sm">
            <span className="text-red-400 font-medium flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              Requires attention
            </span>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900">
          <h3 className="font-semibold text-white">Recent Activity</h3>
        </div>
        <div className="divide-y divide-slate-800">
          {[
            { id: 1, action: "Document verified on blockchain", target: "AFF-2023-901", time: "10 mins ago", type: "success" },
            { id: 2, action: "New case opened", target: "CASE-0092", time: "45 mins ago", type: "info" },
            { id: 3, action: "Failed login attempt", target: "USR-7721", time: "2 hours ago", type: "warning" },
            { id: 4, action: "Document uploaded", target: "EV-9921-A", time: "3 hours ago", type: "info" },
            { id: 5, action: "Security scan completed", target: "System", time: "5 hours ago", type: "success" },
          ].map((activity) => (
            <div key={activity.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`h-2 w-2 rounded-full ${
                  activity.type === 'success' ? 'bg-emerald-500' :
                  activity.type === 'warning' ? 'bg-red-500' : 'bg-blue-500'
                }`} />
                <div>
                  <p className="text-sm font-medium text-slate-200">{activity.action}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{activity.target}</p>
                </div>
              </div>
              <span className="text-xs text-slate-500">{activity.time}</span>
            </div>
          ))}
        </div>
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/50 text-center">
          <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">View All Activity →</button>
        </div>
      </div>
    </div>
  );
}
