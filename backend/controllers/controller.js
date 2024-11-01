const User = require('../model/Users.js'); 
const bcrypt = require('bcrypt');    


const get_details = async (req, res) => {

  const userId = req.user._id;

  try {

    const user = await User.findById(userId, 'myImage name email phone linkedin gender password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

const update_details = async (req, res) => {

  const {
    name,
    email,
    phone,
    profilePhoto,
    linkedin,
    gender,
    password
  } = req.body;

  const userId = req.user.id;

  const user = await User.findById(userId);

  if (password) {
    // If new password is provided, hash it
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      // If the new password matches the current password, use the existing hashed password
      updatedPassword = user.password;
    } else {
      // Otherwise, hash the new password
      const salt = bcrypt.genSaltSync(10);
      updatedPassword = bcrypt.hashSync(password, salt);
    }
  }

  const myImage = profilePhoto;

  try {
    const updatedProfile = await User.findOneAndUpdate(
      { _id: userId },
      {
        name,
        email,
        phone,
        myImage,
        linkedin,
        gender,
        password : updatedPassword,
      },
      { new: true, runValidators: true } // Add runValidators if you have validation rules
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', updatedProfile });
  } catch (error) {
    console.error('Error updating profile:', error); // Log the full error object
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};


module.exports = { get_details, update_details }; 