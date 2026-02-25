const mongoose = require("mongoose");

const invoiceLineSchema = new mongoose.Schema({
  invoiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invoice"
  },
  description: String,
  quantity: Number,
  unitPrice: Number,
  lineTotal: Number
});

module.exports = mongoose.model("InvoiceLine", invoiceLineSchema);