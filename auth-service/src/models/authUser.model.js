class AuthUser {
  constructor(id, email, password, createdAt) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
  }

  static fromDbRow(row) {
    return new AuthUser(
      row.id,
      row.email,
      row.password,
      row.created_at
    );
  }

  toSafeObject() {
    return {
      id: this.id,
      email: this.email,
      createdAt: this.createdAt
    };
  }
}

module.exports = AuthUser;
