// src/pages/PublicProfilePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function PublicProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);

  // Provide a fallback if your env variable isn't set
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/users/${username}`);
        setProfile(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, [apiUrl, username]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h1>Profile of {profile.username}</h1>
      {profile.profilePicture && (
        <img src={profile.profilePicture} alt="Profile" />
      )}

      <div>
        {profile.gallery.map((url, i) => (
          <img key={i} src={url} alt={`Art ${i}`} />
        ))}
      </div>
    </div>
  );
}

export default PublicProfilePage;
