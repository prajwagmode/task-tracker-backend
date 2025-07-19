const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { _id: user._id, email: user.email }, // Add more fields if needed
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

module.exports = generateToken;
