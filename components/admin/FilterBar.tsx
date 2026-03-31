'use client';

import { AREAS } from '@/lib/constants';

interface FilterBarProps {
  area: string;
  onAreaChange: (area: string) => void;
  candidateOnly: boolean;
  onCandidateChange: (val: boolean) => void;
  search: string;
  onSearchChange: (val: string) => void;
}

export default function FilterBar({ area, onAreaChange, candidateOnly, onCandidateChange, search, onSearchChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <input
        className="glass px-4 py-2 text-sm text-foreground placeholder:text-muted/50 focus:outline-none flex-1 min-w-[200px]"
        placeholder="Isim ile ara..."
        value={search}
        onChange={e => onSearchChange(e.target.value)}
      />
      <select
        className="glass px-4 py-2 text-sm text-foreground bg-transparent focus:outline-none"
        value={area}
        onChange={e => onAreaChange(e.target.value)}
      >
        <option value="" className="bg-card">Tum Alanlar</option>
        {AREAS.map(a => <option key={a.key} value={a.key} className="bg-card">{a.name}</option>)}
      </select>
      <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
        <input
          type="checkbox"
          checked={candidateOnly}
          onChange={e => onCandidateChange(e.target.checked)}
          className="accent-teal"
        />
        Sadece adaylar
      </label>
    </div>
  );
}
