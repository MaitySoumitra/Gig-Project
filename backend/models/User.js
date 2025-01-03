const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  firstName: {
      type: String,
      required: true,
      trim: true,  
  },
  lastName: {
      type: String,
      required: true,
      trim: true,  
  },
  email: {
      type: String,
      required: true,
      unique: true,
      trim: true,  
      lowercase: true,  
  },
  password: {
      type: String,
      required: true,
      minlength: 6,  
  },
  phoneNumber: {
      type: String,
      required: false,
      trim: true,  
  },
  photo: {
      type: String, 
      required: false,  
  },
  role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
  },
  address: {
      street: {
          type: String,
          required: false,
      },
      city: {
          type: String,
          required: false,
      },
      state: {
          type: String,
          required: false,
      },
      postalCode: {
          type: String,
          required: false,
      },
      country: {
          type: String,
          required: false,
      },
  },
  dateOfBirth: {
      type: Date,
      required: false,
  },
  gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: false,
  },
  status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
  },
  socialMediaLinks: {
      facebook: {
          type: String,
          required: false,
      },
      twitter: {
          type: String,
          required: false,
      },
      linkedin: {
          type: String,
          required: false,
      },
      instagram: {
          type: String,
          required: false,
      },
  },
  preferences: {
      language: {
          type: String,
          default: 'en',
          enum: ['en', 'fr', 'es', 'de'],
      },
      receiveNewsletter: {
          type: Boolean,
          default: true,
      },
  },
  is2FAEnabled: {
      type: Boolean,
      default: false,
  },
  twoFAMethod: {
      type: String,
      enum: ['sms', 'email', 'authenticator'],
      required: false,
  },
  lastLogin: {
      type: Date,
      required: false,
  },
  createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
  },
  updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
  },
  resetToken: {  
      type: String,
  },
  resetTokenExpiration: {  
      type: Date,
  },
}, {
  timestamps: true,
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.password.startsWith('$2a$')) {
      return next();  
  }
  try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
  } catch (err) {
      next(err);
  }
});

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password); 
};

module.exports = mongoose.model('User', UserSchema);
