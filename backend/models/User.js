import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: (v) => v.endsWith('@jaduniv.edu.in'),
      message: 'Must be a valid Jadavpur University email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  year: {
    type: String,
    required: true,
    enum: ['1st yr IT', '2nd yr IT', '3rd yr IT', '4th yr IT', '1st yr CSE', '2nd yr CSE', '3rd yr CSE', '4th yr CSE', 'Other']
  },
  bio: {
    type: String,
    maxlength: 200,
    default: ''
  },
  profilePic: {
    type: String,
    default: ''
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);