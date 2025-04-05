const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  shortId: { type: String, required: true, unique: true },
  redirectURL: { type: String, required: true },
  visitHistory: [{ timeStamp: { type: Number } }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  expiresAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('URL', urlSchema);