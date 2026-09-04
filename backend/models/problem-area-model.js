const { Schema, model } = require("mongoose");

const ProblemAreaSchema = new Schema(
  {
    name: { type: String, required: true },
    territory: String,
    status: {
      type: String,
      enum: ["detected", "planned", "cleaned"],
      default: "detected",
    },
    problemType: {
      type: String,
      enum: ["trash", "pollution", "other"],
      default: "other",
    },
    coordinates: String,
    area: Number,
    eventId: String,
    dzz: {
      source: String,
      imageUrl: String,
      coordinates: String,
      date: Date,
      type: String,
      detectedObjects: [String],
      confidence: Number,
    },
  },
  { timestamps: true },
);

module.exports = model("ProblemArea", ProblemAreaSchema);
