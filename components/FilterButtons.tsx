'use client';

import { CaricatureFeatures } from '../data/imagesData';

interface FilterButtonsProps {
  activeFilters: CaricatureFeatures[];
  onFilterToggle: (filter: CaricatureFeatures) => void;
}

const filterLabels = {
  [CaricatureFeatures.GLASSES]: 'Glasses',
  [CaricatureFeatures.BEARD]: 'Beard',
  [CaricatureFeatures.LONG_AIR]: 'Long hair',
  [CaricatureFeatures.EARRINGS]: 'Earrings',
  [CaricatureFeatures.MAN]: 'Man',
  [CaricatureFeatures.GROUP]: 'Group'
};

export default function FilterButtons({ activeFilters, onFilterToggle }: FilterButtonsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {Object.entries(filterLabels).map(([key, label]) => {
        const filter = parseInt(key) as CaricatureFeatures;
        const isActive = activeFilters.includes(filter);
        
        return (
          <button
            key={filter}
            onClick={() => onFilterToggle(filter)}
            className={`
              px-6 py-3 rounded-full font-semibold text-lg transition-all duration-300
              transform hover:scale-105 active:scale-95
              ${isActive 
                ? 'bg-[#00BEF4] text-white shadow-lg' 
                : 'bg-[#033778] text-white shadow-md hover:shadow-lg'
              }
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
} 