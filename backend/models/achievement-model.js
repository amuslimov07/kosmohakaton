const { Schema, model } = require("mongoose");

const AchievementSchema = new Schema({
  code: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  description: String,
  icon: String,
});

module.exports = model("Achievement", AchievementSchema);
