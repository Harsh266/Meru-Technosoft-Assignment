import { useEffect, useState } from "react";

const InvoicePage = () => {
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [loadingPDF, setLoadingPDF] = useState(false);

  const invoiceId = "699f31dfa3652920378e9549";

  const fetchInvoice = async () => {
    const res = await fetch(`http://localhost:5000/api/invoices/${invoiceId}`);
    const result = await res.json();
    setData(result);
  };

  useEffect(() => {
    fetchInvoice();
  }, []);

  // Add payment
  const handleAddPayment = async () => {
    try {
      await fetch(`http://localhost:5000/api/invoices/${invoiceId}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: Number(amount) }),
      });

      setShowModal(false);
      setAmount("");
      fetchInvoice();
    } catch (err) {
      console.log(err);
    }
  };

  // PDF download
  const handleDownloadPDF = async () => {
    try {
      setLoadingPDF(true);

      const res = await fetch(
        `http://localhost:5000/api/invoices/pdf/${invoiceId}`
      );

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice_${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
      setLoadingPDF(false);
    } catch (err) {
      console.log("PDF download error:", err);
      setLoadingPDF(false);
    }
  };

  // Overdue days
  const getDaysOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diff = today - due;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const getDisplayStatus = (status) => {
    switch (status) {
      case "PENDING":
        return "PENDING";
      case "PAID":
        return "Paid";
      case "OVERDUE":
        return "Overdue";
      default:
        return status;
    }
  };

  if (!data) return <div className="p-6">Loading...</div>;

  const { invoice, lines, payments, total, amountPaid, balanceDue } = data;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">

        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold">
              {invoice.invoiceNumber}
            </h1>
            <p className="text-gray-600">{invoice.customerName}</p>
          </div>

          <div className="flex gap-3 items-center">

            <span
              className={`px-3 py-1 rounded-full text-sm ${
                invoice.status === "PAID"
                  ? "bg-green-100 text-green-600"
                  : invoice.status === "OVERDUE"
                  ? "bg-red-100 text-red-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {getDisplayStatus(invoice.status)}
            </span>

            <button
              onClick={handleDownloadPDF}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
            >
              {loadingPDF ? "Generating..." : "PDF"}
            </button>

          </div>
        </div>

        <div className="flex justify-between text-sm text-gray-500 mt-4">
          <p>
            Issue Date: {new Date(invoice.issueDate).toLocaleDateString()}
          </p>

          <div className="text-right">
            <p>
              Due Date: {new Date(invoice.dueDate).toLocaleDateString()}
            </p>

            {invoice.status === "OVERDUE" && (
              <p className="text-red-500 text-xs">
                {getDaysOverdue(invoice.dueDate)} days overdue
              </p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="font-semibold mb-2">Line Items</h2>

          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Line Total</th>
              </tr>
            </thead>

            <tbody>
              {lines.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="p-2">{item.description}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-center">₹{item.unitPrice}</td>
                  <td className="text-center font-medium">
                    ₹{item.lineTotal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-right space-y-1">
          <p>Total: ₹{total}</p>
          <p>Amount Paid: ₹{amountPaid}</p>

          <p
            className={`text-lg font-bold ${
              invoice.status === "OVERDUE" ? "text-red-600" : ""
            }`}
          >
            Balance Due: ₹{balanceDue}
          </p>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold">Payments</h2>

            <button
              onClick={() => setShowModal(true)}
              disabled={invoice.status === "PAID"}
              className={`px-4 py-1 rounded text-white ${
                invoice.status === "PAID"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              + Add Payment
            </button>
          </div>

          {payments.length === 0 ? (
            <p className="text-gray-500 text-sm">No payments yet</p>
          ) : (
            payments.map((p) => (
              <div
                key={p._id}
                className="flex justify-between border-b py-2 text-sm"
              >
                <span>₹{p.amount}</span>
                <span className="text-gray-500">
                  {new Date(p.paymentDate).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>

      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg">

            <h2 className="text-lg font-semibold mb-4">
              Add Payment
            </h2>

            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleAddPayment}
                className="bg-green-500 text-white px-4 py-1 rounded"
              >
                Add
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicePage;