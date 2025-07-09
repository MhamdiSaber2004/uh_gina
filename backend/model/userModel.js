const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"]
  },
  phoneNumber: {
    type: Number,
    required: [true, "phone number is required"],
    match: [/^[2459]\d{7}$/, "Please add a valid phone number"]
  },
  adress: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    trim: true,
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'livreur', 'client'],
    default: 'client'
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, name: this.name, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

module.exports = mongoose.model("User", userSchema);
