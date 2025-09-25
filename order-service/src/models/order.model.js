class Order {
  constructor(id, userId, productName, quantity, price, status, createdAt, updatedAt) {
    this.id = id;
    this.userId = userId;
    this.productName = productName;
    this.quantity = quantity;
    this.price = price;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromDbRow(row) {
    return new Order(
      row.id,
      row.user_id,
      row.product_name,
      row.quantity,
      row.price,
      row.status,
      row.created_at,
      row.updated_at
    );
  }

  toObject() {
    return {
      id: this.id,
      userId: this.userId,
      productName: this.productName,
      quantity: this.quantity,
      price: this.price,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Order;
