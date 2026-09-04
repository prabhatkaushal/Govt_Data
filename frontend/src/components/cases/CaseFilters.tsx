import { Search, Filter } from "lucide-react";

export function CaseFilters() {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="relative flex-1 min-w-[250px] group">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-content-muted group-focus-within:text-accent transition-colors" />
        <input 
          type="text" 
          placeholder="Search cases by ID or title..." 
          className="w-full bg-surface border border-border rounded pl-9 pr-4 py-2 text-sm text-content-primary focus:outline-none focus:border-accent/50 focus:bg-elevated transition-colors"
        />
      </div>
      <div className="flex gap-3">
        <div className="relative">
          <Filter className="w-4 h-4 absolute left-3 top-2.5 text-content-muted pointer-events-none" />
          <select className="bg-surface border border-border rounded pl-9 pr-8 py-2 text-xs font-bold tracking-widest uppercase text-content-secondary focus:outline-none focus:border-accent/50 appearance-none transition-colors">
            <option>Status: All</option>
            <option>Active</option>
            <option>Under Investigation</option>
            <option>Closed</option>
          </select>
        </div>
        <select className="bg-surface border border-border rounded px-4 py-2 text-xs font-bold tracking-widest uppercase text-content-secondary focus:outline-none focus:border-accent/50 appearance-none transition-colors">
          <option>Priority: All</option>
          <option>Critical</option>
          <option>High</option>
          <option>Medium</option>
        </select>
      </div>
    </div>
  );
}
