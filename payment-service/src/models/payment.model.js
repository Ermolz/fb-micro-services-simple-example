class Payment {
  constructor(paymentId, userId, orderId, amount, status, createdAt, updatedAt) {
    this.paymentId = paymentId;
    this.userId = userId;
    this.orderId = orderId;
    this.amount = amount;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromDbRow(row) {
    return new Payment(
      row.payment_id,
      row.user_id,
      row.order_id,
      row.amount,
      row.status,
      row.created_at,
      row.updated_at
    );
  }

  toObject() {
    return {
      paymentId: this.paymentId,
      userId: this.userId,
      orderId: this.orderId,
      amount: this.amount,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Payment;
