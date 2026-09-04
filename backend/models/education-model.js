const { Schema, model } = require("mongoose");

const EducationSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  modules: [
    {
      title: String,
      description: String,
      lesson: String,
      question: String,
      options: [String],
      answer: Number,
      points: { type: Number, default: 10 },
    },
  ],
});

module.exports = model("Education", EducationSchema);
