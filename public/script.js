const JSON_HEADER = { 'Content-Type': 'application/json' };

const numChildren = (obj, i) => {
  for (let child in obj['children']) {
    if (child.hasOwnProperty('children')) 
      numChildren(obj, ++i);
  }
  
  return i;
};

const renderWeb = () => {
  fetch('/api/web', {
    method: 'GET',
    headers: JSON_HEADER
  })
  .then(res => res.json())
  .then(rows => {
    if (!rows)
      return;

    const ideaTree = [rows[0]];
    for (let bubble of rows) {
      if (bubble == rows[0])
        continue;

      if (!bubble.Parent) {
        ideaTree.append(bubble);
        continue;
      }

      for (let idea of ideaTree) {
        console.log(numChildren(idea, 1));
        if (bubble.Parent = idea.ID) {
          match = true;
          if (!idea.hasOwnProperty('children'))
            idea['children'] = [bubble];
          else
            idea['children'].append(bubble);
          
          continue;
        }
      }
    }

    $('body').append(`<canvas id="canvas" width="600" height="600"></canvas>`);
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "30px Share Tech Mono";
    context.fillText(rows[0].Title, 150, 150);
    context.fillText(rows[0].Body, 150, 200);
    context.beginPath();
    context.ellipse(150, 150, 50, 75, Math.PI / 2, 0, 2 * Math.PI);
    context.stroke();

    console.log(ideaTree);
  })
  .catch(err => console.error('Error:', err));
};

if (window.location.pathname === '/') {
  renderWeb();

  $('#parent-plus').click(event => {
    $('.modal').modal('show');
  });

  $('#parent-submit-btn').click(event => {
    addIdea(this);
  });
}