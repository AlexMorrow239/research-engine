import React, { useState } from 'react';
import './FiltersBar.scss';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterGroup {
  label: string;
  options: FilterOption[];
}

interface TopicGroup {
  label: string;
  options: FilterOption[];
}

const schoolOptions: FilterOption[] = [
  { value: "arts_sciences", label: "College of Arts and Sciences" },
  { value: "business", label: "Miami Herbert Business School" },
  { value: "communication", label: "School of Communication" },
  // ... add other schools
];

const topicGroups: TopicGroup[] = [
  {
    label: "College of Arts and Sciences",
    options: [
      { value: "biology", label: "Biology" },
      { value: "chemistry", label: "Chemistry" },
      // ... add other topics
    ]
  },
  {
    label: "Miami Herbert Business School",
    options: [
      { value: "accounting", label: "Accounting" },
      { value: "finance", label: "Finance" },
      // ... add other topics
    ]
  },
  // ... add other groups
];

interface FiltersBarProps {
  onFilterChange?: (filterId: string, value: string) => void;
  onSearch?: (value: string) => void;
}

const FiltersBar: React.FC<FiltersBarProps> = ({ onFilterChange, onSearch }) => {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [searchValue, setSearchValue] = useState<string>('');

  const handleSelect = (filterId: string, value: string) => {
    setSelectedFilters(prev => ({ ...prev, [filterId]: value }));
    onFilterChange?.(filterId, value);
  };

  const clearFilter = (filterId: string) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterId];
      return newFilters;
    });
    onFilterChange?.(filterId, '');
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch?.(value);
  };

  return (
    <div className="filters">
      <div className="filters__group">
        <label className="filters__label">Colleges</label>
        <div className="filters__select-wrapper">
          <select 
            className="filters__select"
            value={selectedFilters.schools || ''}
            onChange={(e) => handleSelect('schools', e.target.value)}
          >
            <option value="">All Schools</option>
            {schoolOptions.map(school => (
              <option key={school.value} value={school.value}>
                {school.label}
              </option>
            ))}
          </select>
          {selectedFilters.schools && (
            <button 
              className="filters__clear-button"
              onClick={() => clearFilter('schools')}
              aria-label="Clear school filter"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="filters__group">
        <label className="filters__label">Topics</label>
        <div className="filters__select-wrapper">
          <select 
            className="filters__select"
            value={selectedFilters.topics || ''}
            onChange={(e) => handleSelect('topics', e.target.value)}
          >
            <option value="">All Topics</option>
            {topicGroups.map(group => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {selectedFilters.topics && (
            <button 
              className="filters__clear-button"
              onClick={() => clearFilter('topics')}
              aria-label="Clear topic filter"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="filters__search">
        <div className="filters__search-box">
          <img 
            src="/images/search-286.png" 
            alt="Search" 
            className="filters__search-icon" 
          />
          <input
            type="text"
            className="filters__search-input"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default FiltersBar;