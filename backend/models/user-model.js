const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
  cleanedCount: { type: Number, default: 0 },
  cleanedDistance: { type: Number, default: 0 },
  refCount: { type: Number, default: 0 },
  placesCount: { type: Number, default: 0 },
});

module.exports = model("User", UserSchema);
