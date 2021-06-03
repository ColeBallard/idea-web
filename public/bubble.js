class Bubble {
  constructor(id, title, body, parent) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.parent = parent;
  }

  renderHTML() {
    return `<div class="bubble text-center"><b>${this.title}</b>  <br /> ${this.body}</div>`;
  }
}