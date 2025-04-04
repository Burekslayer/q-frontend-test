// src/pages/ProfilePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ProfilePage.css';

const TAG_OPTIONS = ['Nature', 'Abstract', 'Modern', 'Portrait', 'Landscape', 'Fantasy', 'Realism'];

function ProfilePage({ token, onLogout }) {
  const [profilePicture, setProfilePicture] = useState('');
  const [artGallery, setArtGallery] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false);
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
      setProfilePicture(response.data.profilePicture);
      alert('Profile picture uploaded!');
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  const handleGalleryFileChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      price: '',
      tag: ''
    }));
    setGalleryImages(previews);
  };

  const updateGalleryImage = (index, field, value) => {
    const updated = [...galleryImages];
    updated[index][field] = value;
    setGalleryImages(updated);
  };

  const handleGalleryUpload = async () => {
    if (galleryImages.some(img => !img.price || !img.tag)) {
      alert("Each image must have a price and a tag.");
      return;
    }

    const formData = new FormData();

    const dimensions = await Promise.all(
      galleryImages.map((img) =>
        new Promise(resolve => {
          const imageObj = new Image();
          imageObj.onload = () => resolve({ width: imageObj.width, height: imageObj.height });
          imageObj.src = img.preview;
        })
      )
    );

    galleryImages.forEach((img, i) => {
      formData.append('images', img.file);
      formData.append('widths', dimensions[i].width);
      formData.append('heights', dimensions[i].height);
      formData.append('prices', img.price);
      formData.append('tags', img.tag);
    });

    try {
      await axios.post(`${apiUrl}/api/users/gallery`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Images uploaded to gallery!');
      setGalleryImages([]); 
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Gallery upload failed');
    }
    
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfilePicture(response.data.profilePicture || '');
        setArtGallery(response.data.gallery || []);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    fetchProfileData();
  }, [apiUrl, token]);

  const handleLogout = () => onLogout();

  const handleImageSelect = (url) => {
    setSelectedImages((prev) =>
      prev.includes(url) ? prev.filter((item) => item !== url) : [...prev, url]
    );
  };

  const handleDelete = async () => {
    if (selectedImages.length === 0) {
      alert('No images selected.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete the selected images?')) {
      return;
    }

    try {
      await axios.delete(`${apiUrl}/api/users/gallery`, {
        data: { images: selectedImages },
        headers: { Authorization: `Bearer ${token}` },
      });

      setArtGallery((prev) => prev.filter((item) => !selectedImages.includes(item.url)));
      setSelectedImages([]);
      setDeleteMode(false);
      alert('Images deleted successfully.');
      
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('Error deleting images.');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img className="profile-image" src={profilePicture} alt="Profile" />
        <h2 className="profile-name">John Doe</h2>
      </div>

      <div className="profile-actions">
        <button onClick={handleLogout}>Log Out</button>
        <button onClick={() => setDeleteMode(!deleteMode)}>
          {deleteMode ? 'Cancel' : 'Delete Images'}
        </button>
        {deleteMode && <button onClick={handleDelete}>Confirm Delete</button>}
      </div>

      <form onSubmit={handleProfileUpload}>
        <input type="file" name="profilePic" accept="image/*" />
        <button type="submit">Upload Profile Picture</button>
      </form>

      <form onSubmit={(e) => e.preventDefault()}>
        <input type="file" accept="image/*" multiple onChange={handleGalleryFileChange} />

        {galleryImages.map((img, index) => (
          <div key={index} className="image-preview-entry">
            <img src={img.preview} alt={`preview-${index}`} style={{ width: 100 }} />
            <input
              type="number"
              placeholder="Price"
              value={img.price}
              onChange={(e) => updateGalleryImage(index, 'price', e.target.value)}
            />
            <select
              value={img.tag}
              onChange={(e) => updateGalleryImage(index, 'tag', e.target.value)}
            >
              <option value="">Select tag</option>
              {TAG_OPTIONS.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        ))}

        <button onClick={handleGalleryUpload}>Upload to Gallery</button>
      </form>

      <div className="profile-gallery">
        {artGallery.map((painting, index) => (
          <div key={index} className="profile-gallery-item">
            <img src={painting.url} alt={`Painting ${index + 1}`} />
            {deleteMode && (
              <input
                type="checkbox"
                onChange={() => handleImageSelect(painting.url)}
                checked={selectedImages.includes(painting.url)}
              />
            )}
            <p>Artist: {painting.artistName}</p>
            <p>Dimensions: {painting.width} x {painting.height}</p>
            <p>Price: ${painting.price}</p>
            <p>Tags: {painting.tags.join(', ')}</p>
          </div>
        ))}
      </div>

      <Link to="/general">Back to General Page</Link>
    </div>
  );
}

export default ProfilePage;