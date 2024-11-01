import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Edit from '@mui/icons-material/Edit';
import "./Styles/profile.css";
import TextField from '@mui/material/TextField';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import FormLabel from '@mui/material/FormLabel';
import { useLocation } from 'react-router-dom';
import { API } from '../AuthContext';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    profilePhoto: '',
    gender: '',
    linkedin: '',
    password: '',
  });
  const location = useLocation(); // Use useLocation to access route state
  const { state } = location;
  const tokenFromUrl = state ? state.token : null; // Access token from route state
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Create a ref for the file input
  const fileInputRef = useRef(null);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    // Fetch profile data from backend
    const fetchProfileData = async () => {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      try {
        const response = await axios.get(`${API}/routes/get_details`, {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in request header
          },
        });

        // Fetch the profile photo from backend if available
        const Image_getting = response.data.myImage;

        if (Image_getting) {
          // Set the profile photo (base64 string) as the preview image
          setImagePreview(Image_getting);
        }

        // Merge fetched data with existing profileData
        setProfileData(prevData => ({
          ...prevData,
          ...response.data,
          profilePhoto: Image_getting || '' // Set profile photo
        }));

      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);


  // Function to handle when the user clicks the profile photo
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger file input click
    }
  };

  // Handle file input change for the profile photo
  const handlePhotoChange = async (event) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const file = files[0];
      const base64 = await convertToBase64(file);
      setImagePreview(base64);
      setProfileData(prevData => ({ ...prevData, profilePhoto: base64 }));
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
      fileReader.readAsDataURL(file);
    });
  };


  const handleInputChange = (e) => {
    const { name, value, type, options } = e.target;

    if (type === 'select-multiple') {
      // Handle multiple select values
      const values = Array.from(options)
        .filter(option => option.selected)
        .map(option => option.value);
      setProfileData({ ...profileData, [name]: values });
    } else {
      setProfileData({ ...profileData, [name]: value });
    }
  };


  // Handle form submission to save profile data
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    const { name, email, phone,gender, password } = profileData;

    // Check if all fields are filled
    if (!name || !email || !phone || !gender || !password) {
      alert("All fields are required.");
      return;
    }

    // Check if phone number is numeric
    if (!/^\d+$/.test(phone)) {
      alert("Phone number must be numeric.");
      return;
    }

    // Add fields to the form data
    for (const [key, value] of Object.entries(profileData)) {
      if (Array.isArray(value)) {
        value.forEach(val => formData.append(`${key}[]`, val));
      } else {
        formData.append(key, value);
      }
    }

    const token = tokenFromUrl || localStorage.getItem('token');

    try {
      const response = await axios.post(`${API}/routes/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        alert('Profile updated successfully');
      } else {
        console.error('Failed to update profile:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };


  return (
    <div className="profile-page">
      <div className="profile-left">
        <div className="profile-photo-section">
          <div className="photo-wrapper">
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="profile-photo-preview"
                  onClick={handleImageClick} // Click handler to show dropdown
                />
                <Edit style={{ display: "none" }}
                  className="edit-icon"
                  onClick={handleImageClick} // Click handler to toggle dropdown
                />
              </>
            ) : (
              <div className="default-photo" onClick={handleImageClick}>
                Upload Photo
                <Edit
                  className="edit-icon"
                  onClick={handleImageClick} // Click handler to toggle dropdown
                />
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            name="profilePhoto"
            style={{ display: 'none' }}
            onChange={handlePhotoChange}
          />

          <div className="profile-name">
            <h3>{profileData.name || 'Your Name'}</h3>
          </div>
        </div>
      </div>

      <div className="profile-right">
        <form className='flexing_part' onSubmit={handleSubmit}>
          <div className="profile-field">
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              name="name"
              required 
              value={profileData.name}
              onChange={handleInputChange}
              style={{ marginBottom: "20px" }}
              InputProps={{
                style: {
                  fontSize: "1.5rem", // Adjust font size
                  color: 'black', // Text color
                  backgroundColor: 'white', // Background color

                }
              }}
              InputLabelProps={{
                style: {
                  fontSize: '1.5rem', // Adjust font size for label
                  color: 'black', // Label color
                  marginBottom: '10px'
                }

              }}
            />
          </div>

          <div className="profile-field">
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              name="email"
              required // Mark as required
              value={profileData.email}
              onChange={handleInputChange}
              style={{ marginBottom: "20px" }}
              InputProps={{
                readOnly: true,
                style: {
                  fontSize: "1.5rem",
                  color: 'black', // Text color
                  backgroundColor: 'white', // Background color

                }
              }}
              InputLabelProps={{
                style: {
                  fontSize: '1.5rem', // Label font size
                  color: 'black', // Label color
                }
              }}
            />
          </div>

          <div className="profile-field">
            <TextField
              label="Phone"
              variant="outlined"
              fullWidth
              name="phone"
              required // Mark as required
              value={profileData.phone}
              onChange={handleInputChange}
              style={{ marginBottom: "20px" }}
              InputProps={{
                style: {
                  fontSize: "1.5rem",
                  color: 'black', // Text color
                  backgroundColor: 'white', // Background color

                }
              }}
              InputLabelProps={{
                style: {
                  fontSize: '1.5rem', // Label font size
                  color: 'black', // Label color
                }
              }}
            />
          </div>

          <div className="profile-field">
            <TextField
              label="Enter LinkedID"
              variant="outlined"
              fullWidth
              name="linkedin"
              value={profileData.linkedin}
              onChange={handleInputChange}
              style={{ marginBottom: "20px" }}
              InputProps={{
                classes: {
                  input: 'custom-input', // Use the custom class here
                },
                style: {
                  fontSize: "1.5rem",
                  color: 'black',
                  backgroundColor: 'white',
                  boxSizing: 'border-box',
                }
              }}

              InputLabelProps={{
                style: {
                  height: "100%",
                  fontSize: '1.5rem', // Label font size
                  color: 'black', // Label color
                }
              }}
            />
          </div>

          <div className="gender-field" style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', width: '45%', marginLeft: "50px" }}>
            <FormLabel component="legend" style={{ fontSize: '1.5rem', color: 'white', marginBottom: '10px' }}>
              Select Gender
            </FormLabel>
            <RadioGroup
              name="gender"
              value={profileData.gender}
              onChange={handleInputChange}
              required // Mark as required
              style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }} // Center the radio buttons
            >
              <FormControlLabel value="Male" control={<Radio style={{ color: 'white' }} />} label="Male" />
              <FormControlLabel value="Female" control={<Radio style={{ color: 'white' }} />} label="Female" />
              <FormControlLabel value="Not Specified" control={<Radio style={{ color: 'white' }} />} label="Not Specified" />
            </RadioGroup>
          </div>

          <div className="profile-field">
            <TextField
              label="Enter Password"
              variant="outlined"
              fullWidth
              name="password"
              required // Mark as required
              value={profileData.password}
              onChange={handleInputChange}
              style={{ marginBottom: "20px", height: '56px' }} // Set a fixed height
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                classes: {
                  input: 'custom-input', // Use the custom class here
                },
                style: {
                  fontSize: "1.5rem",
                  color: 'black',
                  backgroundColor: 'white',
                  boxSizing: 'border-box',
                  height: '100%', // Ensure the height is 100%
                },
                endAdornment: (
                  <InputAdornment position="end" style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={handleTogglePasswordVisibility} edge="end" style={{ height: '100%' }}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                style: {
                  height: "100%",
                  fontSize: '1.5rem', // Label font size
                  color: 'black', // Label color
                },
              }}
            />
          </div>


        </form>
        <button className='center' type="submit" onClick={handleSubmit}>Save Profile</button>
      </div>
    </div>
  );
};

export default Profile;
