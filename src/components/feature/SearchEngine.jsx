import React, { useState, useRef, useEffect } from 'react';
import { FilterIcon, TrashIcon, SearchIcon, ChangeIcon, CloseIcon, HomeIcon} from '../../assets/icon';
import { useNavigate } from 'react-router-dom';

const SearchFilter = ({ data, onFilterChange, changeMode, setChangeMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const filterPopupRef = useRef(null);
  const filterButtonRef = useRef(null);

  const navigate = useNavigate()

  useEffect(() => {
    applyFilters();
  }, [searchTerm, activeFilters]);

  const createNewFilter = () => {
    return {
      id: Date.now(),
      column: 0,
      condition: 'contains',
      value: ''
    };
  };

  const addFilter = () => {
    setActiveFilters(prev => [...prev, createNewFilter()]);
  };

  const removeFilter = (filterId) => {
    setActiveFilters(prev => prev.filter(f => f.id !== filterId));
  };

  const updateFilter = (id, field, value) => {
    setActiveFilters(prev =>
      prev.map(filter =>
        filter.id === id ? { ...filter, [field]: value } : filter
      )
    );
  };

  const applyFilters = () => {
    if (!data || data.length === 0) return;

    const filteredData = data.filter((row, index) => {
      if (index === 0) return true; // Keep header row

      // Apply search filter
      if (searchTerm && !row[0].toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Apply all other filters
      return activeFilters.every(filter => {
        const cellValue = (row[filter.column] || "").toString().toLowerCase();
        const filterValue = filter.value.toLowerCase();

        switch (filter.condition) {
          case 'contains':
            return cellValue.includes(filterValue);
          case 'not_contains':
            return !cellValue.includes(filterValue);
          default:
            return true;
        }
      });
    });

    onFilterChange(filteredData);
  };

  const resetFilters = () => {
    setActiveFilters([]);
    setSearchTerm('');
    onFilterChange(data);
    setShowFilterPopup(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 my-3">
      <button
          onClick={()=>navigate("/")}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          title="Home"
        >
          {HomeIcon}
        </button>
        <div className="relative w-full">
          <div className='absolute left-3 top-3 flex items-center justify-center'>
            {SearchIcon}
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name..."
            className="w-full pl-10 pr-3 py-2 border-2 border-gray-300 rounded-full outline-none focus:border-blue-500 text-sm"
          />
        </div>
        <button
          ref={filterButtonRef}
          onClick={() => setShowFilterPopup(!showFilterPopup)}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          title="Filter data"
        >
          {FilterIcon}
        </button>
        <button
          ref={filterButtonRef}
          onClick={() => setChangeMode(!changeMode)}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          title="Change mode"
        >
          {ChangeIcon}
        </button>
      </div>

      {showFilterPopup && (
        <div
          ref={filterPopupRef}
          className="absolute right-8 top-12 z-50 bg-white border border-gray-300 rounded-md p-7 min-w-[150px] max-w-xl max-h-xl overflow-y-auto"
          style={{
            boxShadow: "0 0 3px rgba(0,0,0,0.1), 0 3px 3px rgba(0,0,0,0.1)"
          }}>
          <button
            className="absolute right-2 top-1 w-7 h-7 flex justify-center items-center hover:bg-gray-200 transition-colors duration-200 rounded-full p-2"
            onClick={() => setShowFilterPopup(false)}>
            {CloseIcon}
          </button>
          <div className="space-y-3">
            {activeFilters.map(filter => (
              <div key={filter.id} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
                <select
                  value={filter.column}
                  onChange={(e) => updateFilter(filter.id, 'column', parseInt(e.target.value))}
                  className="p-1 border border-gray-300 rounded text-sm"
                >
                  {data[0]?.map((header, index) => (
                    <option key={index} value={index}>
                      {header}
                    </option>
                  ))}
                </select>

                <select
                  value={filter.condition}
                  onChange={(e) => updateFilter(filter.id, 'condition', e.target.value)}
                  className="p-1 border border-gray-300 rounded text-sm"
                >
                  <option value="contains">contains</option>
                  <option value="not_contains">not contain</option>
                </select>

                <input
                  type="text"
                  value={filter.value}
                  onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
                  placeholder="Enter value..."
                  className="p-1 border border-gray-300 rounded text-sm"
                />

                <button
                  onClick={() => removeFilter(filter.id)}
                  className='w-8 h-8 bg-transparent hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center rounded-full'>
                  {TrashIcon}
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={addFilter}
              className="px-3 py-1 bg-cyan-700 text-white rounded hover:bg-cyan-800 text-sm"
            >
              Add filter
            </button>
            <button
              onClick={resetFilters}
              className="px-3 py-1 bg-cyan-700 text-white rounded hover:bg-cyan-800 text-sm"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;