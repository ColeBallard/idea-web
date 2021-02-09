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

// DOM Manipulation

const currentNotesList = document.getElementById('current-notes-list');

const JSON_HEADER = { 'Content-Type': 'application/json' };

const clearInput = () => {
  $('#note-title, #note-data').val('');
};

const showErrorMessage = () => {

};

const renderNoteList = () => {
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
      });

      $('#current-notes-list').append(listItem);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
};

const deleteNote = title => {
  console.log(title);
  fetch(`/api/notes/${title}`, {
    method: 'DELETE',
    headers: JSON_HEADER
  })
  .catch((error) => {
    console.error('Error:', error);
  });
  
  renderNoteList();
};

const addNote = note => {
  fetch(`/api/notes`, {
    method: 'POST',
    headers: JSON_HEADER,
    body: JSON.stringify(note),
  })
  .then((response) => response.json())
  .then((noteData) => {
    return noteData;
  })
  .catch((error) => {
    console.error('Error:', error);
  });
};

function removeIndex(array, index) {
  let arrayLength = array.length, newArray = [];

  for (let i = 0; i <= (arrayLength - 1); i++) {
    if (i != index) 
      newArray.push(array[i]);
  }

  for (let j = 0; j <= (arrayLength - 1); j++)
    array.shift();

  let newArrayLength = newArray.length;

  for (let k = 0; k <= (newArrayLength - 1); k++) 
    array.push(newArray[k]);
}

const replacePlaceholder = (template, placeholder, value) => {
  const pattern = new RegExp("{{ " + placeholder + " }}", "gm");
  return template.replace(pattern, value);
};

const renderNoteListItem = note => {
  let template = TEMPLATES.noteListItem;
  template = replacePlaceholder(template, "title", note.title);
  return template;
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
  });

  $('#current-notes-list').append(listItem);
};

const renderNote = note => {
  let template = TEMPLATES.note;
  template = replacePlaceholder(template, "title", note.title);
  template = replacePlaceholder(template, "note", note.note);
 
  return template;
};

const toggleNoteEdit = (edit, note) => {
  if (edit) {
    $('#current-note').hide();
    $('#note-editor').show();
  }
  else {
    $('#note-editor').hide();
    $('#current-note').show();
    $('#current-note').empty(); 
    $('#current-note').append($.parseHTML(renderNote(note)));
  }
};

const validate = title => {
  if ($('#note-editor').css('display') === 'none')
    return false;
  
  if (title.length < 1)
    return false;

  return fetch(`/api/notes/${title}`, {
    method: 'GET',
    headers: JSON_HEADER,
  })
  .then((response) => response.json())
  .then(data => {
    if (!data)
      return true;
    else 
      return false;
  })
  .catch((error) => {
    console.error('Error:', error);
  });
};

const newNote = async note => {
  const valid = await validate(note.title);

  if (valid) {
    addNote(note);
    addNoteListItem(renderNoteListItem(note),note);
    clearInput();
  }
  else 
    showErrorMessage();
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