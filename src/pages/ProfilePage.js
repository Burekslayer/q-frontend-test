// src/pages/ProfilePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ProfilePage.css'; // We'll put specific styles for profile page in this file

function ProfilePage({ token, onLogout }) {
  const [profilePicture, setProfilePicture] = useState('');
  const [artGallery, setArtGallery] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  const handleProfileUpload = async (event) => {
    event.preventDefault();
    const file = event.target.elements.profilePic.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await axios.post(`${apiUrl}/api/users/profile-picture`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          });

      // The server should return { profilePicture: 'https://...' }
        const newProfilePicUrl = response.data.profilePicture;
        setProfilePicture(newProfilePicUrl);

      alert('Profile picture uploaded!');
      // Optionally refetch user data to display updated pic
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };


  const handleGalleryUpload = async (event) => {
    event.preventDefault();
    const files = event.target.elements.galleryPics.files; // could be multiple
    if (!files.length) return;
  
    const formData = new FormData();
    for (let file of files) {
      formData.append('images', file);
    }
  
    try {
      await axios.post(`${apiUrl}/api/users/gallery`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Images uploaded to gallery!');
      // Optionally refetch user data
    } catch (err) {
      console.error(err);
      alert('Gallery upload failed');
    }
  };

  // Example: fetch profile data on mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        // The server should return { username, profilePicture, gallery }
        setProfilePicture(response.data.profilePicture || '');
        setArtGallery(response.data.gallery || []);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
  
    fetchProfileData();
  }, [apiUrl, token]);

  console.log(profilePicture)
  // Example protected route test
  const handleProtected = async () => {
    try {
      const response = await axios.get(`${apiUrl}/protected`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(response.data);
    } catch (error) {
      alert(error.response?.data || 'Access denied');
    }
  };

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="profile-container">

        {/* Profile Header Section */}
        <div className="profile-header">
            <img className="profile-image" src={profilePicture} alt="Profile" />
            <h2 className="profile-name">John Doe</h2>
        </div>  

        {/* Buttons */}
        <div className="profile-actions">
            <button onClick={handleProtected}>Test Protected Route</button>
            <button onClick={handleLogout}>Log Out</button>
        </div>  

        {/* Gallery Section */}
        <div className="gallery">
            {artGallery.map((imageUrl, index) => (
                <div key={index} className="gallery-item">
                    <img src={imageUrl} alt={`Artwork ${index + 1}`} />
                </div>
            ))}
        </div>

        <div>
            {/* some display stuff */}
            <form onSubmit={handleProfileUpload}>
                <input type="file" name="profilePic" accept="image/*" />
                <button type="submit">Upload Profile Picture</button>
            </form>
        </div>
        <form onSubmit={handleGalleryUpload}>
            <input type="file" name="galleryPics" accept="image/*" multiple />
            <button type="submit">Upload to Gallery</button>
        </form>
        <Link to="/general">Back to General Page</Link>
    </div>
  );
}

export default ProfilePage;
