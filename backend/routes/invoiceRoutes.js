const express = require("express");
const router = express.Router();

const {
  getInvoiceDetails,
  addPayment,
  archiveInvoice,
  restoreInvoice,
  getInvoicePDF,
} = require("../controllers/invoiceController");

router.post("/archive", archiveInvoice);
router.post("/restore", restoreInvoice);

router.get("/:id", getInvoiceDetails);
router.post("/:id/payments", addPayment);

router.get("/pdf/:id", getInvoicePDF);

module.exports = router;