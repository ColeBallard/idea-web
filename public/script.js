const JSON_HEADER = { 'Content-Type': 'application/json' };

const renderWeb = () => {
  fetch('/api/web', {
    method: 'GET',
    headers: JSON_HEADER
  })
  .then(res => res.json())
  .then(rows => {
    if (!rows)
      return;

    

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