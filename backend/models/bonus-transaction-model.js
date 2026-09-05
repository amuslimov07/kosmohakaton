const { Schema, model } = require("mongoose");

const BonusTransactionSchema = new Schema(
  {
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: [
        "event_participation",
        "achievement",
        "bonus_spend",
        "admin_adjustment",
      ],
      required: true,
    },
    description: { type: String, default: "" },
    eventId: { type: String, default: null },
    rewardId: { type: String, default: null },
    dedupeKey: { type: String, default: null, unique: true, sparse: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

module.exports = model("BonusTransaction", BonusTransactionSchema);
