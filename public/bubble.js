class Bubble {
  constructor(id, title, body, parent, children, depth) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.parent = parent;
    this.children = children;
    this.depth = depth;
  }

  renderHTML() {
    if (!this.title)
      return `<div class="bubble text-center">${this.body}</div>`;
    else
      return `<div class="bubble text-center"><b>${this.title}</b>  <br /> ${this.body}</div>`;
  }
}