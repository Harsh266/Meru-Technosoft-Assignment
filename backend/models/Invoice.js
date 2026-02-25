const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: String,
  customerName: String,
  issueDate: Date,
  dueDate: Date,
  status: {
    type: String,
    enum: ["PENDING", "PAID", "OVERDUE"],
    default: "PENDING"
  },
  total: { type: Number, default: 0 },
  amountPaid: { type: Number, default: 0 },
  balanceDue: { type: Number, default: 0 },
  isArchived: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Invoice", invoiceSchema);