// Media Querying

const stackContent = window.matchMedia("(max-width: 800px)");

const centerContent = document.getElementById('center-content');
const currentNotes = document.getElementById('current-notes');
const notesSidebar = document.getElementById('notes-sidebar');

const mediaQueryChange = change => {
  if (change.matches)
    centerContent.appendChild(currentNotes);
  else 
    notesSidebar.appendChild(currentNotes);
}

// Global Constants

const JSON_HEADER = { 'Content-Type': 'application/json' };

// Helper Functions (DOM Manipulation)

const replacePlaceholder = (template, placeholder, value) => {
  const pattern = new RegExp("{{ " + placeholder + " }}", "gm");
  return template.replace(pattern, value);
};

const renderNoteListItem = note => {
  let template = TEMPLATES.noteListItem;
  template = replacePlaceholder(template, "title", note.title);
  return template;
};

const renderNote = note => {
  let template = TEMPLATES.note;
  template = replacePlaceholder(template, "title", note.title);
  template = replacePlaceholder(template, "note", note.note);
 
  return template;
};

const validate = title => {
  if ($('#note-editor').css('display') === 'none')
    return -900;
  
  if (title.length < 1)
    return -800;

  return fetch(`/api/notes/${title}`, {
    method: 'GET',
    headers: JSON_HEADER,
  })
  .then((response) => response.json())
  .then(data => {
    if (!data)
      return 1;
    else 
      return -700;
  })
  .catch(error => console.error('Error:', error));
};

const clearInput = () => {
  $('#note-title, #note-data').val('');
};

const toggleNoteEdit = (edit, note) => {
  if (edit) {
    $('#current-note').hide();
    $('#note-editor').show();
    $('#save-note-btn').show();
  }
  else {
    $('#note-editor').hide();
    $('#current-note').show();
    $('#current-note').empty(); 
    $('#current-note').append($.parseHTML(renderNote(note)));
    $('#save-note-btn').hide();
  }
};

// Error Handling

const showErrorMessage = flag => {
  switch (flag) {
    case -900:
      $('.toast-body').text('Nothing to save.');
      break;
    case -800:
      $('.toast-body').text('Invalid title.');
      break;
    case -700:
      $('.toast-body').text('A note already exists with that title.');
      break;
    default:
      console.log('error message error');
  }
  
  $('.toast').attr('data-bs-delay', 3000);
  $('.toast').toast('show');
};

// DOM Manipulation

const deleteNote = title => {
  fetch(`/api/notes/${title}`, {
    method: 'DELETE',
    headers: JSON_HEADER
  })
  .catch(error => console.error('Error:', error));

  if ($('#current-note').find('h3').text() === title)
    toggleNoteEdit(true, null);
};

const addNoteListItem = (html, note) => {
  let listItem = $.parseHTML(html);
    
  $(listItem).find('.current-note-title').on('click', event => {
    event.preventDefault();
    toggleNoteEdit(false, note);
  });
  $(listItem).find('.delete-note-btn').on('click', event => {
    event.preventDefault();
    deleteNote(note.title);
    renderNoteList();
  });

  $('#current-notes-list').append(listItem);
};

const addNote = note => {
  fetch(`/api/notes`, {
    method: 'POST',
    headers: JSON_HEADER,
    body: JSON.stringify(note),
  })
  .catch(error => console.error('Error:', error));
};

const newNote = async note => {
  const validFlag = await validate(note.title);

  if (validFlag === 1) {
    addNote(note);
    addNoteListItem(renderNoteListItem(note),note);
    clearInput();
  }
  else 
    showErrorMessage(validFlag);
};

const renderNoteList = () => {
  console.log('here');
  fetch('/api/notes', {
    method: 'GET',
    headers: JSON_HEADER
  })
  .then(response => response.json())
  .then(notes => {
    $('#current-notes-list').children().each((index, element) => {
      $(element).find('.current-note-title, .delete-note-btn').off('click');
    });
    
    $('#current-notes-list').empty();

    if (notes.length < 1)
      return;
  
    for (let note of notes) {
      let listItem = $.parseHTML(renderNoteListItem(note));
    
      $(listItem).find('.current-note-title').on('click', event => {
        event.preventDefault();
        toggleNoteEdit(false, note);
      });
      $(listItem).find('.delete-note-btn').on('click', event => {
        event.preventDefault();
        deleteNote(note.title);
        renderNoteList();
      });

      $('#current-notes-list').append(listItem);
    }
  })
  .catch(error => console.error('Error:', error));
};

if (window.location.pathname === '/') {
  mediaQueryChange(stackContent);
  stackContent.addListener(mediaQueryChange);

  renderNoteList();

  $('#create-note-btn').on('click', event => {
    event.preventDefault();
    toggleNoteEdit(true, null);
  });

  $('#save-note-btn').on('click', event => {
    event.preventDefault();

    newNote({
      title: $('#note-title').val().trim(),
      note: $('#note-data').val().trim()
    });
  });
}