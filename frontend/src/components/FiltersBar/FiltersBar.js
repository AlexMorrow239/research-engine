import React from 'react';

export default function FiltersBar() {
  function handleSelect(filterId, value) {
    console.log(`Selected [${filterId}]: ${value}`);
  }

  function clearFilter(filterId) {
    console.log(`Clearing [${filterId}]`);
  }

  function handleSearch(searchValue) {
    console.log('Search input:', searchValue);
  }

  return (
    <div className="filters-bar">
      {/* Schools and Colleges */}
      <div className="filter-group">
        <label>Colleges</label>
        <div className="select-wrapper">
          <select onChange={(e) => handleSelect('schools', e.target.value)}>
            <option value="">All Schools</option>
            <option value="arts_sciences">College of Arts and Sciences</option>
            <option value="business">Miami Herbert Business School</option>
            <option value="communication">School of Communication</option>
            <option value="education">School of Education</option>
            <option value="engineering">College of Engineering</option>
            <option value="architecture">School of Architecture</option>
            <option value="rosenstiel">Rosenstiel School</option>
            <option value="medicine">Miller School of Medicine</option>
            <option value="music">Frost School of Music</option>
            <option value="nursing">School of Nursing</option>
            <option value="law">School of Law</option>
            <option value="graduate">Graduate School</option>
          </select>
          <span className="clear-icon" onClick={() => clearFilter('schools')}>
            &times;
          </span>
        </div>
      </div>

      {/* Topics */}
      <div className="filter-group">
        <label>Topics</label>
        <div className="select-wrapper">
          <select onChange={(e) => handleSelect('topics', e.target.value)}>
            <option value="">All Topics</option>
            {/* Topics for College of Arts and Sciences */}
            <optgroup label="College of Arts and Sciences">
              <option value="biology">Biology</option>
              <option value="chemistry">Chemistry</option>
              <option value="physics">Physics</option>
              <option value="mathematics">Mathematics</option>
              <option value="anthropology">Anthropology</option>
              <option value="sociology">Sociology</option>
              <option value="history">History</option>
              <option value="political_science">Political Science</option>
              <option value="philosophy">Philosophy</option>
              <option value="psychology">Psychology</option>
              <option value="environmental_science">Environmental Science</option>
              <option value="creative_writing">Creative Writing</option>
            </optgroup>

            {/* Topics for Miami Herbert Business School */}
            <optgroup label="Miami Herbert Business School">
              <option value="accounting">Accounting</option>
              <option value="finance">Finance</option>
              <option value="marketing">Marketing</option>
              <option value="management">Management</option>
              <option value="entrepreneurship">Entrepreneurship</option>
              <option value="analytics">Business Analytics</option>
              <option value="real_estate">Real Estate</option>
            </optgroup>

            {/* Topics for other schools */}
            <optgroup label="School of Communication">
              <option value="journalism">Journalism</option>
              <option value="public_relations">Public Relations</option>
              <option value="advertising">Advertising</option>
              <option value="media_production">Media Production</option>
              <option value="digital_communication">Digital Communication</option>
            </optgroup>

            <optgroup label="School of Education">
              <option value="leadership">Educational Leadership</option>
              <option value="curriculum_design">Curriculum Design</option>
              <option value="stem_education">STEM Education</option>
            </optgroup>

            <optgroup label="College of Engineering">
              <option value="civil_engineering">Civil Engineering</option>
              <option value="robotics">Robotics</option>
              <option value="renewable_energy">Renewable Energy Systems</option>
            </optgroup>

            <optgroup label="Rosenstiel School">
              <option value="marine_biology">Marine Biology</option>
              <option value="oceanography">Oceanography</option>
              <option value="climate_science">Climate Science</option>
            </optgroup>

            <optgroup label="Miller School of Medicine">
              <option value="neurology">Neurology</option>
              <option value="cardiology">Cardiology</option>
              <option value="oncology">Oncology</option>
              <option value="pediatrics">Pediatrics</option>
            </optgroup>

            <optgroup label="Frost School of Music">
              <option value="music_performance">Music Performance</option>
              <option value="music_education">Music Education</option>
              <option value="sound_design">Sound Design</option>
            </optgroup>

            <optgroup label="School of Nursing">
              <option value="pediatric_nursing">Pediatric Nursing</option>
              <option value="public_health_nursing">Public Health Nursing</option>
            </optgroup>

            <optgroup label="School of Law">
              <option value="criminal_law">Criminal Law</option>
              <option value="intellectual_property">Intellectual Property Law</option>
            </optgroup>

            <optgroup label="Graduate School">
              <option value="interdisciplinary_research">Interdisciplinary Research</option>
              <option value="postdoc_training">Postdoctoral Research</option>
            </optgroup>
          </select>
          <span className="clear-icon" onClick={() => clearFilter('topics')}>
            &times;
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-group">
        <div className="search-box">
          <img src="/images/search-286.png" alt="Search Icon" className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
