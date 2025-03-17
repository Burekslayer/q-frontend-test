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
        placeholder="Type a username..."
      />
      <button onClick={handleSearch}>Search</button>

      <div style={{ marginTop: '1rem' }}>
        {results.map(user => (
          <div
            key={user.username}
            style={{
              margin: '0.5rem auto',
              border: '1px solid #ccc',
              maxWidth: '400px',
              padding: '0.5rem',
            }}
          >
            {/* If you have a public profile route, link to it */}
            <a href={`/user/${user.username}`}>
              {user.profilePicture && (
                <img
                  src={user.profilePicture}
                  alt={user.username}
                  style={{ width: 50, height: 50, objectFit: 'cover', marginRight: 8 }}
                />
              )}
              {user.username}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchProfiles;
