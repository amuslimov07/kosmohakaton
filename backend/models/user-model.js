const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["volunteer", "employee"], default: "volunteer" },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
  cleanedCount: { type: Number, default: 0 },
  cleanedDistance: { type: Number, default: 0 },
  refCount: { type: Number, default: 0 },
  placesCount: { type: Number, default: 0 },
  bonusBalance: { type: Number, default: 0 },
  totalEarned: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
});

module.exports = model("User", UserSchema);
