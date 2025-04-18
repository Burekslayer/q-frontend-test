// src/pages/PublicProfilePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import './styles/PublicProfilePage.css'

function PublicProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('default');


  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/users/public/${id}`);
        setProfile(response.data);
        setTheme(response.data.profileTheme || 'default');
      } catch (error) {
        setError(error.response?.data || 'Error fetching profile');
      }
    };
    fetchProfile();
  }, [apiUrl, id])


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/users/public/${id}`);
        setProfile(response.data);
      } catch (error) {
        setError(error.response?.data || 'Error fetching profile');
      }
    };
    fetchProfile();
  }, [apiUrl, id]);

  

  if (error) return <div>{error}</div>;
  if (!profile) return <div>Loading...</div>;

  return (
    <div className={`public-profile ${theme}`}>
      <h1>Profile of {profile.firstName} {profile.lastName}</h1>
      {profile.profilePicture && (
        <img src={profile.profilePicture} alt="Profile" style={{ width: 150, height: 150, borderRadius: '50%' }} />
      )}

      <h2>Gallery</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {profile.gallery.map((painting, i) => (
          <div key={i} style={{ margin: '10px' }}>
            <img src={painting.url} alt={`Art ${i}`} style={{ width: 200, height: 200, objectFit: 'cover' }} />
            <p>Artist: {painting.artistName}</p>
            <p>Dimensions: {painting.width} x {painting.height}</p>
            <p>Price: ${painting.price}</p>
            <p>Tags: {painting.tags?.join(', ') || 'No tags'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PublicProfilePage;
