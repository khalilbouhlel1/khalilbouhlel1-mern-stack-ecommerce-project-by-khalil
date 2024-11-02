import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  cartdata: {
    type: Object,
    default: {}
  },
}, {
  timestamps: true,
  minimize: false
});

const UserModel =mongoose.model.user || mongoose.model("User", userSchema);

export default UserModel;
