// src/pages/SearchProfiles.js
import React, { useState } from 'react';
import axios from 'axios';

function SearchProfiles() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleSearch = async () => {
    try {
      // GET /api/users/search?query=someText
      const response = await axios.get(`${apiUrl}/api/users/search?query=${query}`);
      setResults(response.data);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h2>Search Profiles</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type a name, email or art style..."
      />
      <button onClick={handleSearch}>Search</button>

      <div style={{ marginTop: '1rem' }}>
        {results.map(user => (
          <div
          key={user._id || user.email}
          style={{
            margin: '0.5rem auto',
            border: '1px solid #ccc',
            maxWidth: '400px',
            padding: '0.5rem',
          }}
        >
          <a href={`/users/${user._id}`}>
            {user.profilePicture && (
              <img
                src={user.profilePicture}
                alt={`${user.firstName} ${user.lastName}`}
                style={{ width: '50px', height: '50px', borderRadius: '50%' }}
              />
            )}
            <p>{user.firstName} {user.lastName}</p>
          </a>
        </div>
        ))}
      </div>
    </div>
  );
}

export default SearchProfiles;
