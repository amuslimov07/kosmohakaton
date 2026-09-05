const { Schema, model } = require("mongoose");

const EventRegistrationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    eventId: { type: String, required: true },
    status: {
      type: String,
      enum: ["registered", "confirmed", "attended", "absent", "cancelled"],
      default: "registered",
    },
    bonusPoints: { type: Number, default: 0 },
    confirmedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

EventRegistrationSchema.index({ user: 1, eventId: 1 }, { unique: true });
module.exports = model("EventRegistration", EventRegistrationSchema);
