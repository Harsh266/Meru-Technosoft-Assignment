import { useEffect, useState } from "react";

const InvoicePage = () => {
  const [data, setData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const invoiceId = "699f31dfa3652920378e9549";

  const fetchInvoice = async () => {
    const res = await fetch(`http://localhost:5000/api/invoices/${invoiceId}`);
    const result = await res.json();
    setData(result);
  };

  useEffect(() => {
    fetchInvoice();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAddPayment = async () => {
    try {
      await fetch(`http://localhost:5000/api/invoices/${invoiceId}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount) }),
      });
      setShowModal(false);
      setAmount("");
      fetchInvoice();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setLoadingPDF(true);
      const res = await fetch(`http://localhost:5000/api/invoices/pdf/${invoiceId}`);
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

  const getDaysOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diff = today - due;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const getDisplayStatus = (status) => {
    switch (status) {
      case "PENDING": return "Pending";
      case "PAID": return "Paid";
      case "OVERDUE": return "Overdue";
      default: return status;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "PAID": return { color: "#16a34a" };
      case "OVERDUE": return { color: "#dc2626" };
      default: return { color: "#ca8a04" };
    }
  };

  if (!data) return (
    <div style={{ minHeight: "100vh", background: "#f0f0eb", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", color: "#888" }}>
      Loading...
    </div>
  );

  const { invoice, lines, payments, total, amountPaid, balanceDue } = data;
  const statusStyle = getStatusStyle(invoice.status);

  const SidebarContent = () => (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 20px", marginBottom: 32 }}>
        <div style={{ width: 32, height: 32, background: "#3d7a3d", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a", lineHeight: 1.3 }}>Meru Technosoft Pvt. Ltd.</span>
      </div>

      <div style={{ margin: "0 12px 24px", background: "#f7f7f4", borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <div style={{ width: 30, height: 30, background: "#1a1a1a", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>M</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Meru Technosoft Pvt. Ltd.</div>
            <div style={{ fontSize: 11, color: "#888" }}>Business Account</div>
          </div>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" stroke="#888" strokeWidth="2" strokeLinecap="round"/></svg>
      </div>

      <div style={{ padding: "0 12px" }}>
        <div style={{ fontSize: 11, color: "#aaa", fontWeight: 600, letterSpacing: "0.08em", padding: "0 8px", marginBottom: 8 }}>MAIN MENU</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, background: "#1a1a1a", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
          <span style={{ fontSize: 14 }}>■</span>
          Invoices
        </div>
      </div>
    </>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#EEEEE8", fontFamily: "'Segoe UI', system-ui, sans-serif", display: "flex" }}>

      <style>{`
        @media (max-width: 767px) {
          .sidebar-desktop { display: none !important; }
          .hamburger-btn { display: flex !important; }
          .main-content { margin-left: 0 !important; }
          .topbar-search { display: none !important; }
          .topbar-bell { display: none !important; }
          .content-area { flex-direction: column !important; }
          .left-panel { flex: 1 1 100% !important; max-width: 100% !important; }
          .detail-row { flex-direction: column !important; }
          .preview-sticky { position: static !important; }
        }
        @media (min-width: 768px) {
          .sidebar-mobile-overlay { display: none !important; }
          .hamburger-btn { display: none !important; }
        }
      `}</style>

      {/* Sidebar Desktop */}
      <aside className="sidebar-desktop" style={{ width: 260, background: "#fff", borderRight: "1px solid #e5e5e0", display: "flex", flexDirection: "column", padding: "24px 0", position: "fixed", top: 0, left: 0, height: "100vh", overflowY: "auto", zIndex: 20 }}>
        <SidebarContent />
      </aside>

      {/* Sidebar Mobile Overlay */}
      <div className="sidebar-mobile-overlay">
        {sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 30 }} />
        )}
        <aside style={{ position: "fixed", top: 0, left: sidebarOpen ? 0 : "-270px", width: 260, height: "100vh", background: "#fff", display: "flex", flexDirection: "column", padding: "24px 0", zIndex: 40, overflowY: "auto", transition: "left 0.25s ease", borderRight: "1px solid #e5e5e0" }}>
          <button onClick={() => setSidebarOpen(false)} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#888", lineHeight: 1 }}>✕</button>
          <SidebarContent />
        </aside>
      </div>

      {/* Main */}
      <main className="main-content" style={{ marginLeft: 260, flex: 1, minWidth: 0 }}>

        {/* Topbar */}
        <div style={{ background: "#EEEEE8", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              className="hamburger-btn"
              onClick={() => setSidebarOpen(true)}
              style={{ background: "#fff", border: "1px solid #e5e5e0", borderRadius: 8, width: 36, height: 36, alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, display: "none" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="#555" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>

            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a", margin: 0, whiteSpace: "nowrap" }}>Invoice</h1>

            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#555" }}>
              <span style={{ whiteSpace: "nowrap" }}>Show Preview</span>
              <div onClick={() => setShowPreview(!showPreview)} style={{ width: 40, height: 22, background: showPreview ? "#3d7a3d" : "#ccc", borderRadius: 11, position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}>
                <div style={{ width: 16, height: 16, background: "#fff", borderRadius: "50%", position: "absolute", top: 3, left: showPreview ? 21 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}></div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="topbar-search" style={{ background: "#fff", borderRadius: 20, padding: "7px 16px", display: "flex", alignItems: "center", gap: 8, border: "1px solid #e5e5e0", width: 180 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#aaa" strokeWidth="2"/><path d="M21 21l-4.35-4.35" stroke="#aaa" strokeWidth="2" strokeLinecap="round"/></svg>
              <input placeholder="Search" style={{ border: "none", outline: "none", fontSize: 13, color: "#555", width: "100%", background: "transparent" }} />
            </div>
            <div className="topbar-bell" style={{ width: 36, height: 36, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "1px solid #e5e5e0", position: "relative", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="#555" strokeWidth="2" strokeLinecap="round"/></svg>
              <div style={{ width: 8, height: 8, background: "#ef4444", borderRadius: "50%", position: "absolute", top: 6, right: 7 }}></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="content-area" style={{ padding: "8px 20px 28px", display: "flex", gap: 20, alignItems: "flex-start" }}>

          {/* Left */}
          <div className="left-panel" style={{ flex: showPreview ? "0 0 48%" : "1", minWidth: 0 }}>

            {/* Invoice Details */}
            <div style={{ background: "#fff", borderRadius: 14, padding: "22px", marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 16, marginTop: 0 }}>Invoice details</h2>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>Bill to</div>
                <div style={{ border: "1px solid #e5e5e0", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, background: "#e0e7ff", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🏢</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{invoice.customerName}</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M6 9l6 6 6-6" stroke="#888" strokeWidth="2" strokeLinecap="round"/></svg>
                </div>
              </div>

              <div className="detail-row" style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>Invoice number</div>
                  <div style={{ border: "1px solid #e5e5e0", borderRadius: 10, padding: "9px 14px", fontSize: 13, color: "#1a1a1a", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{invoice.invoiceNumber}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>Due date</div>
                  <div style={{ border: "1px solid #e5e5e0", borderRadius: 10, padding: "9px 14px", fontSize: 13, color: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4 }}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{new Date(invoice.dueDate).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><rect x="3" y="4" width="18" height="18" rx="2" stroke="#888" strokeWidth="2"/><path d="M16 2v4M8 2v4M3 10h18" stroke="#888" strokeWidth="2" strokeLinecap="round"/></svg>
                  </div>
                </div>
              </div>

              <div className="detail-row" style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>Issue Date</div>
                  <div style={{ border: "1px solid #e5e5e0", borderRadius: 10, padding: "9px 14px", fontSize: 13, color: "#1a1a1a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {new Date(invoice.issueDate).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>Status</div>
                  <div style={{ border: "1px solid #e5e5e0", borderRadius: 10, padding: "9px 14px", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: statusStyle.color, flexShrink: 0 }}></span>
                    <span style={{ color: statusStyle.color, fontWeight: 600 }}>{getDisplayStatus(invoice.status)}</span>
                    {invoice.status === "OVERDUE" && (
                      <span style={{ fontSize: 11, color: "#dc2626", marginLeft: "auto", whiteSpace: "nowrap" }}>{getDaysOverdue(invoice.dueDate)}d overdue</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            <div style={{ background: "#fff", borderRadius: 14, padding: "22px", marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 16, marginTop: 0 }}>Invoice items</h2>
              <div style={{ overflowX: "auto" }}>
                <div style={{ minWidth: 280 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 70px 70px 70px", gap: 8, marginBottom: 8 }}>
                    <div style={{ fontSize: 12, color: "#888", fontWeight: 600 }}>Items</div>
                    <div style={{ fontSize: 12, color: "#888", fontWeight: 600, textAlign: "center" }}>QTY</div>
                    <div style={{ fontSize: 12, color: "#888", fontWeight: 600, textAlign: "center" }}>Rate</div>
                    <div style={{ fontSize: 12, color: "#888", fontWeight: 600, textAlign: "center" }}>Total</div>
                  </div>
                  {lines.map((item) => (
                    <div key={item._id} style={{ display: "grid", gridTemplateColumns: "1fr 70px 70px 70px", gap: 8, marginBottom: 8 }}>
                      <div style={{ border: "1px solid #e5e5e0", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#1a1a1a" }}>{item.description}</div>
                      <div style={{ border: "1px solid #e5e5e0", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#1a1a1a", textAlign: "center" }}>{item.quantity}</div>
                      <div style={{ border: "1px solid #e5e5e0", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#1a1a1a", textAlign: "center" }}>{item.unitPrice}</div>
                      <div style={{ border: "1px solid #e5e5e0", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#888", textAlign: "center", background: "#f9f9f7" }}>{item.lineTotal}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payments */}
            <div style={{ background: "#fff", borderRadius: 14, padding: "22px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 10 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Payments</h2>
                <button
                  onClick={() => setShowModal(true)}
                  disabled={invoice.status === "PAID"}
                  style={{ background: invoice.status === "PAID" ? "#e5e5e0" : "#3d7a3d", color: invoice.status === "PAID" ? "#aaa" : "#fff", border: "none", borderRadius: 20, padding: "7px 14px", fontSize: 13, fontWeight: 600, cursor: invoice.status === "PAID" ? "not-allowed" : "pointer", whiteSpace: "nowrap", flexShrink: 0 }}
                >
                  + Add Payment
                </button>
              </div>

              {payments.length === 0 ? (
                <p style={{ color: "#aaa", fontSize: 13, margin: 0 }}>No payments yet</p>
              ) : (
                payments.map((p) => (
                  <div key={p._id} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f0f0eb", padding: "10px 0", fontSize: 13 }}>
                    <span style={{ fontWeight: 600, color: "#1a1a1a" }}>₹{p.amount}</span>
                    <span style={{ color: "#aaa" }}>{new Date(p.paymentDate).toLocaleDateString()}</span>
                  </div>
                ))
              )}

              <div style={{ marginTop: 16, paddingTop: 12, borderTop: "2px solid #f0f0eb" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#555", marginBottom: 6 }}>
                  <span>Subtotal</span><span>₹{total}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#555", marginBottom: 6 }}>
                  <span>Amount Paid</span><span>₹{amountPaid}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700, color: invoice.status === "OVERDUE" ? "#dc2626" : "#1a1a1a", marginTop: 8 }}>
                  <span>Balance Due</span><span>₹{balanceDue}</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <button
                onClick={handleDownloadPDF}
                style={{ flex: 1, background: "#3d7a3d", border: "none", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer" }}
              >
                {loadingPDF ? "Generating..." : "⬇ Download PDF"}
              </button>
            </div>
          </div>

          {/* Right: Preview */}
          {showPreview && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="preview-sticky" style={{ background: "#fff", borderRadius: 14, padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", position: "sticky", top: 70 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, gap: 12 }}>
                  <div style={{ minWidth: 0 }}>
                    <h2 style={{ fontSize: 26, fontWeight: 800, color: "#1a1a1a", margin: "0 0 4px" }}>Invoice</h2>
                    <div style={{ fontSize: 12, color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      Invoice Number <span style={{ fontWeight: 600, color: "#1a1a1a" }}>{invoice.invoiceNumber}</span>
                    </div>
                  </div>
                  <div style={{ width: 40, height: 40, background: "#3d7a3d", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>

                <div style={{ background: "#f7f7f4", borderRadius: 10, padding: "16px", marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontSize: 11, color: "#aaa", fontWeight: 600, marginBottom: 4 }}>Billed to</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{invoice.customerName}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, color: "#aaa", fontWeight: 600, marginBottom: 4 }}>Due date</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>
                        {new Date(invoice.dueDate).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
                      </div>
                    </div>
                  </div>
                  {invoice.address && (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ fontSize: 11, color: "#aaa", fontWeight: 600, marginBottom: 4 }}>Address</div>
                      <div style={{ fontSize: 13, color: "#555" }}>{invoice.address}</div>
                    </div>
                  )}
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 260 }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #e5e5e0" }}>
                        <th style={{ textAlign: "left", padding: "8px 0", color: "#888", fontWeight: 600, fontSize: 12 }}>Items</th>
                        <th style={{ textAlign: "center", padding: "8px 0", color: "#888", fontWeight: 600, fontSize: 12 }}>QTY</th>
                        <th style={{ textAlign: "center", padding: "8px 0", color: "#888", fontWeight: 600, fontSize: 12 }}>Rate</th>
                        <th style={{ textAlign: "right", padding: "8px 0", color: "#888", fontWeight: 600, fontSize: 12 }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lines.map((item) => (
                        <tr key={item._id} style={{ borderBottom: "1px solid #f0f0eb" }}>
                          <td style={{ padding: "10px 0", color: "#1a1a1a", fontWeight: 500 }}>{item.description}</td>
                          <td style={{ padding: "10px 0", textAlign: "center", color: "#555" }}>{item.quantity}</td>
                          <td style={{ padding: "10px 0", textAlign: "center", color: "#555" }}>₹{item.unitPrice}</td>
                          <td style={{ padding: "10px 0", textAlign: "right", color: "#1a1a1a", fontWeight: 600 }}>₹{item.lineTotal}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: 16, borderTop: "1px solid #e5e5e0", paddingTop: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#888", marginBottom: 4 }}>
                    <span>Subtotal</span><span>₹{total}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#888", marginBottom: 4 }}>
                    <span>Amount Paid</span><span>₹{amountPaid}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800, color: "#1a1a1a", marginTop: 8 }}>
                    <span>Balance Due</span><span>₹{balanceDue}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "28px", width: "100%", maxWidth: 340, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a", marginBottom: 20, marginTop: 0 }}>Add Payment</h2>
            <input
              type="number"
              placeholder="Enter amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ width: "100%", border: "1px solid #e5e5e0", borderRadius: 10, padding: "10px 14px", fontSize: 14, outline: "none", marginBottom: 20, boxSizing: "border-box" }}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, border: "1px solid #e5e5e0", background: "#fff", borderRadius: 10, padding: "10px", fontSize: 14, fontWeight: 600, cursor: "pointer", color: "#555" }}>
                Cancel
              </button>
              <button onClick={handleAddPayment} style={{ flex: 1, background: "#3d7a3d", border: "none", borderRadius: 10, padding: "10px", fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer" }}>
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