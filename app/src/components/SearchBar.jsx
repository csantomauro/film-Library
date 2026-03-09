function SearchBar({ query, onQueryChange }) {
    const handleClear = () => onQueryChange('');
  
    return (
      <div className="position-relative me-2" style={{ maxWidth: '250px', width: '100%' }}>
        {/* Input field */}
        <input
          type="text"
          className="form-control rounded-pill ps-4.5 pe-5"
          placeholder="Search for a film..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          style={{
            paddingLeft: '2rem', // space for search icon
            transition: 'box-shadow 0.2s ease-in-out',
          }}
        />
  
        {/* Search icon inside input */}
        <SearchIcon
          className="position-absolute"
          style={{
            left: '12px',
            top: '50%',
            width: '18px',
            height: '18px',
            transform: 'translateY(-50%)',
            color: '#888',
            pointerEvents: 'none',
          }}
        />
  
        {/* Clear button (modern, circular) */}
        {query && (
          <button
            type="button"
            className="btn btn-light p-0 d-flex align-items-center justify-content-center"
            style={{
              position: 'absolute',
              right: '6px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              fontSize: '14px',
              lineHeight: 1,
              color: '#555',
            }}
            onClick={handleClear}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
    );
  }
  
  function SearchIcon({ className, style }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={style}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    );
  }
  
  export default SearchBar;
  