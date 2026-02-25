const checkOverdue = (invoice) => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(invoice.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    if (invoice.status !== "PAID" && dueDate < today) {
        return "OVERDUE";
    }

    return invoice.status || "PENDING";
};

module.exports = checkOverdue;