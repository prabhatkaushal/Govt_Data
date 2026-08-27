import Link from "next/link";

interface Case {
  id: string;
  title: string;
  status: "Active" | "Closed" | "Pending";
  classification: "Top Secret" | "Confidential" | "Unclassified";
  date: string;
}

const mockCases: Case[] = [
  { id: "CASE-0092", title: "Operation Northern Light", status: "Active", classification: "Top Secret", date: "2023-10-12" },
  { id: "CASE-0091", title: "Cybercom Audit Q3", status: "Active", classification: "Confidential", date: "2023-10-10" },
  { id: "CASE-0089", title: "Vendor Risk Assessment", status: "Pending", classification: "Unclassified", date: "2023-10-05" },
  { id: "CASE-0085", title: "Incident Response #441", status: "Closed", classification: "Top Secret", date: "2023-09-28" },
];

export default function CasesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Cases</h1>
          <p className="text-slate-400 mt-1">Manage and monitor active investigations and operations.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
          + New Case
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex gap-4">
          <input 
            type="text" 
            placeholder="Search cases by ID or title..." 
            className="flex-1 bg-slate-950 border border-slate-800 rounded-md px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <select className="bg-slate-950 border border-slate-800 rounded-md px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500">
            <option>All Status</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Closed</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4 font-medium">Case ID</th>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Classification</th>
                <th className="px-6 py-4 font-medium">Date Opened</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {mockCases.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-400">
                    <Link href={`/cases/${c.id}`}>{c.id}</Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">{c.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      c.status === 'Active' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' : 
                      c.status === 'Pending' ? 'bg-amber-900/30 text-amber-400 border-amber-800' : 
                      'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                      c.classification === 'Top Secret' ? 'bg-red-900/50 text-red-400' :
                      c.classification === 'Confidential' ? 'bg-blue-900/50 text-blue-400' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {c.classification.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{c.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/cases/${c.id}`} className="text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                      View Details →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
