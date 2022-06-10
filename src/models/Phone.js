const mongoose = require("mongoose");

const PhoneSchema = new mongoose.Schema(
  {
    userID: { type: String, required: true },
    name: { type: String, required: true },
    desc: { type: String, required: true},
    ip: { type: String, required: true },
    model: { type: String, required: true },
    color: { type: String, required: true },
    img:   {
      // data: Buffer,
      data: String,
      contentType: String
  }

  },
  { timestamps: true }
);

module.exports = mongoose.model("Phone", PhoneSchema);