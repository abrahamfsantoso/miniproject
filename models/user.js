const mongoose = require("mongoose"); // Import mongoose
const mongooseDelete = require("mongoose-delete"); // Import mongoose-delete
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      set: encryptPassword,
    },
    role: {
      type: String,
      enum : ['user','admin'],
      default: "user",
      required: true,
    },
    mobile_phone: {
      type: String,
      required: false,
      default: null,
    },
    profile_picture: {
      type: String,
      required: false,
      default: null,
      get: getProfilePicture,
    },
  },
  {
    // Enable timestamps
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    toJSON: { getters: true }, // Enable getter
  }
);

// Getter photo
function getProfilePicture(photo) {
  if (!photo) {
    return null;
  }

  return `/images/${photo}`;
}

function encryptPassword(password) {
  const encryptedPasswword = bcrypt.hashSync(password, 10);
  return encryptedPasswword;
}

// Enable soft delete
UserSchema.plugin(mongooseDelete, { overrideMethods: "all" });

module.exports = mongoose.model("user", UserSchema); // Export barang models
