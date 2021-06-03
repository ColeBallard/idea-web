class Bubble {
  constructor(title, body) {
    this.title = title;
    this.body = body;
  }

  renderHTML() {
    return this.title + this.body;
  }
}