const PDFDocument = require("pdfkit");

const generateInvoicePDF = (invoice, res) => {
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        `inline; filename=invoice_${invoice._id}.pdf`
    );

    doc.pipe(res);

    doc
        .fontSize(22)
        .text("INVOICE", { align: "center" })
        .moveDown();

    doc
        .fontSize(12)
        .text("Meru Technosoft")
        .text("Ahmedabad, India")
        .text("Email: merutechnosoft@company.com")
        .moveDown();

    doc
        .fontSize(14)
        .text("Bill To:")
        .fontSize(12)
        .text(invoice.customerName)
        .moveDown();

    doc
        .text(`Invoice Date: ${new Date().toLocaleDateString()}`)
        .text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`)
        .moveDown();

    doc
        .fontSize(12)
        .text(`Total: ₹${invoice.total}`)
        .moveDown();

    if (invoice.items && invoice.items.length > 0) {

    doc.moveDown();
    doc.fontSize(14).text("Items", { underline: true });
    doc.moveDown(0.5);

    // Table Header
    const tableTop = doc.y;
    const itemX = 50;
    const qtyX = 250;
    const rateX = 320;
    const totalX = 400;

    doc.fontSize(12).text("Item", itemX, tableTop);
    doc.text("Qty", qtyX, tableTop);
    doc.text("Rate", rateX, tableTop);
    doc.text("Total", totalX, tableTop);

    doc.moveTo(itemX, tableTop + 15)
       .lineTo(550, tableTop + 15)
       .stroke();

    let y = tableTop + 25;

    invoice.items.forEach((item) => {
        doc.text(item.description, itemX, y);
        doc.text(item.quantity.toString(), qtyX, y);
        doc.text(`₹${item.unitPrice}`, rateX, y);
        doc.text(`₹${item.lineTotal}`, totalX, y);

        y += 20;
    });

    doc.moveDown();
}

    doc
        .fontSize(10)
        .text("Thank you for your business!", { align: "center" });

    doc.end();
};

module.exports = generateInvoicePDF;