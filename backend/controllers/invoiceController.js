const Invoice = require("../models/Invoice");
const InvoiceLine = require("../models/InvoiceLine");
const Payment = require("../models/Payment");
const generateInvoicePDF = require("../utils/pdfGenerator");
const checkOverdue = require("../utils/overdueChecker");

exports.getInvoiceDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findById(id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const lines = await InvoiceLine.find({ invoiceId: id });
    const payments = await Payment.find({ invoiceId: id });

    res.json({
      invoice,
      lines,
      payments,
      total: invoice.total,
      amountPaid: invoice.amountPaid,
      balanceDue: invoice.balanceDue
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const amount = Number(req.body.amount);

    const invoice = await Invoice.findById(id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const balanceDue = invoice.total - invoice.amountPaid;

    if (amount > balanceDue) {
      return res.status(400).json({ message: "Overpayment not allowed" });
    }

    const payment = await Payment.create({
      invoiceId: id,
      amount
    });

    invoice.amountPaid += amount;
    invoice.balanceDue = invoice.total - invoice.amountPaid;

    if (invoice.balanceDue <= 0) {
      invoice.status = "PAID";
    }

    await invoice.save();

    res.json({ message: "Payment added", payment });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.archiveInvoice = async (req, res) => {
  try {
    const { id } = req.body;

    await Invoice.findByIdAndUpdate(id, { isArchived: true });

    res.json({ message: "Invoice archived" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.restoreInvoice = async (req, res) => {
  try {
    const { id } = req.body;

    await Invoice.findByIdAndUpdate(id, { isArchived: false });

    res.json({ message: "Invoice restored" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getInvoicePDF = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        const items = await InvoiceLine.find({
            invoiceId: invoice._id
        });

        const invoiceData = {
            ...invoice.toObject(),
            items
        };

        generateInvoicePDF(invoiceData, res);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        const updatedStatus = checkOverdue(invoice);

        invoice.status = updatedStatus;

        res.json({ invoice });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
