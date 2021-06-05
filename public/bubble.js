class Bubble {
  constructor(id, title, body, parent, size) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.parent = parent;
    this.size = size
  }

  renderHTML() {
    if (!this.title)
      return `<div class="bubble text-center">${this.body}</div>`;
    else
      return `<div class="bubble text-center"><b>${this.title}</b>  <br /> ${this.body}</div>`;
  }
}