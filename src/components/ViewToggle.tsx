'use client';

import { Grid3X3, List } from 'lucide-react';
import Button from '@/components/ui/Button';

type ViewMode = 'grid' | 'list';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export default function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-2 bg-white rounded-xl border border-[#E5EAF1] p-1">
      <Button
        variant={viewMode === 'grid' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('grid')}
        className={`flex items-center gap-2 px-3 py-2 view-toggle-button ${
          viewMode === 'grid' 
            ? 'bg-[#0476D9] text-white' 
            : 'text-[#010D26] hover:bg-[#F3F7FA]'
        }`}
      >
        <Grid3X3 className="w-4 h-4" />
        <span className="text-sm font-medium">Grid</span>
      </Button>
      
      <Button
        variant={viewMode === 'list' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('list')}
        className={`flex items-center gap-2 px-3 py-2 view-toggle-button ${
          viewMode === 'list' 
            ? 'bg-[#0476D9] text-white' 
            : 'text-[#010D26] hover:bg-[#F3F7FA]'
        }`}
      >
        <List className="w-4 h-4" />
        <span className="text-sm font-medium">List</span>
      </Button>
    </div>
  );
} 