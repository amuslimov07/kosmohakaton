const { Schema, model } = require("mongoose");

const UserProgressSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Education", required: true },
    completedModules: [{ type: Number }],
    points: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["not-started", "in-progress", "completed"],
      default: "not-started",
    },
  },
  { timestamps: true },
);

UserProgressSchema.index({ user: 1, course: 1 }, { unique: true });
module.exports = model("UserProgress", UserProgressSchema);
