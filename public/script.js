const JSON_HEADER = { 'Content-Type': 'application/json' };

const renderWeb = () => {
  fetch('/api/web', {
    method: 'GET',
    headers: JSON_HEADER
  })
  .then(res => res.json())
  .then(rows => {
    const webContainer = $('#web-container');
    for (let bubble of rows) {
      webContainer.append(new Bubble(bubble.ID, bubble.Title, bubble.Body, bubble.Parent).renderHTML());
    }
    const panzoom = Panzoom(document.getElementById('web-container'), {
      maxScale: 5
    });
    panzoom.pan(10, 10)
    panzoom.zoom(2, { animate: true });
    document.getElementById('web-container').parentElement.addEventListener('wheel', panzoom.zoomWithWheel)
  })
  .catch(err => console.error('Error:', err));
};

if (window.location.pathname === '/') {
  renderWeb();
}