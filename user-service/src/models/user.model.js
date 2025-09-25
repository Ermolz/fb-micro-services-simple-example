class User {
  constructor(id, userId, name, email, phone, address, createdAt, updatedAt) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromDbRow(row) {
    return new User(
      row.id,
      row.user_id,
      row.name,
      row.email,
      row.phone,
      row.address,
      row.created_at,
      row.updated_at
    );
  }

  toObject() {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      email: this.email,
      phone: this.phone,
      address: this.address,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = User;
