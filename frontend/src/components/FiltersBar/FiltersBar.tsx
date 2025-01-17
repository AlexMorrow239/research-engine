import React, { useState } from 'react';
import './FiltersBar.scss';

interface FiltersBarProps {
  onFilterChange?: (filterId: string, value: string) => void;
  onSearch?: (value: string) => void;
}

const FiltersBar: React.FC<FiltersBarProps> = ({ onFilterChange, onSearch }) => {
  const [searchValue, setSearchValue] = useState<string>('');

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch?.(value);
  };

  return (
    <div className="filters">
      <div className="filters__group">
        Colleges
        <select 
          onChange={(e) => onFilterChange?.('schools', e.target.value)}
          defaultValue=""
        >
          <option value="">All Schools</option>
          <option value="arts_sciences">College of Arts and Sciences</option>
          <option value="business">Miami Herbert Business School</option>
          <option value="communication">School of Communication</option>
        </select>
      </div>

      <div className="filters__group">
        Topics
        <select 
          onChange={(e) => onFilterChange?.('topics', e.target.value)}
          defaultValue=""
        >
          <option value="">All Topics</option>
          <option value="biology">Biology</option>
          <option value="chemistry">Chemistry</option>
          <option value="physics">Physics</option>
        </select>
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