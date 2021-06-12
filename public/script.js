const JSON_HEADER = { 'Content-Type': 'application/json' };

const AVG_B = 400;

const calculateXY = (bubble, i) => {
  if (!bubble.parent) {
    let d = 0;
    for (let j = 0; j <= (bubble.Depth - 1); j++)
      d += AVG_B * Math.pow(0.5, j);
    let a = 0.1 * i * 15;
    return [(d + a) * Math.cos(a), (d + a) * Math.sin(a)]
  }
};

const renderBubble = (bubble, coord) => {
  return `<div class='bubble' style='left:${coord[0]}px; top:${coord[1]}px'>
  <div class='bubble-title'>${bubble.title}</div>
  <div class= bubble-body'>${bubble.body}</div>
  </div>`;
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

    const webContainer = $('#web-container');

    let i = 0;
    for (let row of rows) {
      if (!row.Parent) 
        i++;
        
      const b = new Bubble(row.ID, row.Title, row.Body, row.Parent, row.Children, row.Depth);

      webContainer.append(renderBubble(b, calculateXY(b, i)));
    }

    const panzoom = Panzoom(document.getElementById('web-container'), {
      maxScale: 5
    });
    panzoom.pan(10, 10);
    panzoom.zoom(2, { animate: true });
    document.getElementById('web-container').parentElement.addEventListener('wheel', panzoom.zoomWithWheel);
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