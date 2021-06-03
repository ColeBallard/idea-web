const JSON_HEADER = { 'Content-Type': 'application/json' };

const renderWeb = () => {
  fetch('/api/web', {
    method: 'GET',
    headers: JSON_HEADER
  })
  .then(response => response.json())
  .then(rows => {
    console.log(rows);
  })
  .catch(error => console.error('Error:', error));
};

if (window.location.pathname === '/') {
  renderWeb();
}