class Notification {
  constructor(id, userId, type, title, message, read, createdAt) {
    this.id = id;
    this.userId = userId;
    this.type = type;
    this.title = title;
    this.message = message;
    this.read = read;
    this.createdAt = createdAt;
  }

  static fromMongoDoc(doc) {
    return new Notification(
      doc._id.toString(),
      doc.userId,
      doc.type,
      doc.title,
      doc.message,
      doc.read || false,
      doc.createdAt
    );
  }

  toObject() {
    return {
      id: this.id,
      userId: this.userId,
      type: this.type,
      title: this.title,
      message: this.message,
      read: this.read,
      createdAt: this.createdAt
    };
  }

  toMongoDoc() {
    return {
      userId: this.userId,
      type: this.type,
      title: this.title,
      message: this.message,
      read: this.read,
      createdAt: this.createdAt || new Date()
    };
  }
}

module.exports = Notification;
