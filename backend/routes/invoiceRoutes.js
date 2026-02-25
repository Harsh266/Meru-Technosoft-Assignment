const express = require("express");
const router = express.Router();

const {
  getInvoiceDetails,
  addPayment,
  archiveInvoice,
  restoreInvoice
} = require("../controllers/invoiceController");

router.post("/archive", archiveInvoice);
router.post("/restore", restoreInvoice);

router.get("/:id", getInvoiceDetails);
router.post("/:id/payments", addPayment);

module.exports = router;