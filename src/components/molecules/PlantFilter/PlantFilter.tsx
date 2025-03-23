import React, { useState } from 'react';
import { PlantCategory, SunExposure, WaterNeeds, GrowthRate } from '../../../types';

interface PlantFilterProps {
  categories: PlantCategory[];
  sunExposures: SunExposure[];
  waterNeeds: WaterNeeds[];
  growthRates: GrowthRate[];
  tags: string[];
  onFilterChange: (filters: any) => void;
}

const PlantFilter: React.FC<PlantFilterProps> = ({
  categories,
  sunExposures,
  waterNeeds,
  growthRates,
  tags,
  onFilterChange
}) => {
  const [filters, setFilters] = useState({
    category: '',
    sunExposure: '',
    waterNeeds: '',
    growthRate: '',
    tags: [] as string[],
    search: '',
    maxMaintenanceDifficulty: 5
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    
    const newFilters = { ...filters, tags: newTags };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleMaintenanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const newFilters = { ...filters, maxMaintenanceDifficulty: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      category: '',
      sunExposure: '',
      waterNeeds: '',
      growthRate: '',
      tags: [] as string[],
      search: '',
      maxMaintenanceDifficulty: 5
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">Filter Plants</h3>
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search by name..."
          className="input w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="input w-full capitalize"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category} className="capitalize">
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sun Exposure</label>
          <select
            name="sunExposure"
            value={filters.sunExposure}
            onChange={handleChange}
            className="input w-full"
          >
            <option value="">All Sun Exposures</option>
            {sunExposures.map(exposure => (
              <option key={exposure} value={exposure}>
                {exposure === 'full-sun' ? 'Full Sun' :
                 exposure === 'partial-sun' ? 'Partial Sun' :
                 exposure === 'shade' ? 'Shade' : exposure}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Water Needs</label>
          <select
            name="waterNeeds"
            value={filters.waterNeeds}
            onChange={handleChange}
            className="input w-full capitalize"
          >
            <option value="">All Water Needs</option>
            {waterNeeds.map(need => (
              <option key={need} value={need} className="capitalize">
                {need}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Growth Rate</label>
          <select
            name="growthRate"
            value={filters.growthRate}
            onChange={handleChange}
            className="input w-full capitalize"
          >
            <option value="">All Growth Rates</option>
            {growthRates.map(rate => (
              <option key={rate} value={rate} className="capitalize">
                {rate}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Maximum Maintenance Difficulty: {filters.maxMaintenanceDifficulty}
        </label>
        <input
          type="range"
          min="1"
          max="5"
          value={filters.maxMaintenanceDifficulty}
          onChange={handleMaintenanceChange}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Easy</span>
          <span>Medium</span>
          <span>Difficult</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Popular Tags</label>
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 12).map(tag => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`px-3 py-1 rounded-full text-sm ${
                filters.tags.includes(tag)
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleReset}
        className="w-full btn btn-outline"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default PlantFilter;