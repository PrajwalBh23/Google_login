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

  try {
    // Retrieve the current user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let updatedPassword = user.password; // Default to the existing password

    if (password) {
      // Check if the user.password exists before comparing
      if (user.password) {
        // If new password is provided, check if it's already hashed
        const isCurrentPasswordCorrect = await bcrypt.compare(password, user.password);

        if (isCurrentPasswordCorrect) {
          // If the provided password matches the hashed password, keep it unchanged
          updatedPassword = user.password;
        } else {
          // Otherwise, hash the new password
          const salt = await bcrypt.genSalt(10); // Use async version
          updatedPassword = await bcrypt.hash(password, salt); // Hash the new password
        }
      } else {
        // Handle case where user.password is undefined or not hashed
        const salt = await bcrypt.genSalt(10);
        updatedPassword = await bcrypt.hash(password, salt); // Hash the new password
      }
    }

    const updatedProfile = await User.findOneAndUpdate(
      { _id: userId },
      {
        name,
        email,
        phone,
        myImage: profilePhoto,
        linkedin,
        gender,
        password: updatedPassword, // Update with the hashed password
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