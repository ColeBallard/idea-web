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

const showErrorMessage = () => {

};

const renderNoteList = () => {
  fetch('/api/notes', {
    method: 'GET',
    headers: JSON_HEADER
  })
  .then(response => response.json())
  .then(notes => {
    currentNotesList.innerHTML = '';

    if (notes.length < 1)
      return;
    
    let temp, listItem;
    for (let note of notes) {
      temp = document.createElement('div');
      temp.innerHTML = renderNoteListItem(note);
      listItem = temp.firstChild;
      listItem.getElementsByClassName('current-note-title')[0].addEventListener('click', event => {
        event.preventDefault();
        console.log(note);
        toggleNoteEdit(false, note);
      });
      listItem.getElementsByClassName('delete-note-btn')[0].addEventListener('click', event => {
        event.preventDefault();
        console.log(note);
        deleteNote(note.title);
      });
      currentNotesList.appendChild(listItem);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
};

const deleteNote = title => {
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
  currentNotesList.innerHTML += html;
  let listItem = currentNotesList.lastChild;
  listItem.getElementsByClassName('current-note-title')[0].addEventListener('click', event => {
    event.preventDefault();
    console.log(note);
    toggleNoteEdit(false, note);
  });
  listItem.getElementsByClassName('delete-note-btn')[0].addEventListener('click', event => {
    event.preventDefault();
    console.log(note);
    deleteNote(note.title);
  });
};

const renderNote = note => {
  let template = TEMPLATES.note;
  template = replacePlaceholder(template, "title", note.title);
  template = replacePlaceholder(template, "note", note.note);
 
  return template;
};

const toggleNoteEdit = (edit, note) => {
  const noteEditor = document.getElementById('note-editor');
  const currentNote = document.getElementById('current-note');
  if (edit) {
    currentNote.style.display = 'none';
    noteEditor.style.display = 'block';
  }
  else {
    noteEditor.style.display = 'none';
    currentNote.style.display = 'block';
    currentNote.innerHTML = renderNote(note);
  }
};

const createNoteListener = (listItem, note) => {
};  

const createDeleteListener = (button, note) => {
  
};

const validate = title => {
  if (document.getElementById('note-editor').style.display === 'none')
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
  }
  else 
    showErrorMessage();
};

if (window.location.pathname === '/') {
  mediaQueryChange(stackContent);
  stackContent.addListener(mediaQueryChange);

  renderNoteList();

  document.getElementById('create-note-btn').addEventListener('click', event => {
    event.preventDefault();
    toggleNoteEdit(true, null);
  });

  document.getElementById('save-note-btn').addEventListener('click', event => {
    event.preventDefault();

    newNote({
      title: document.getElementById('note-title').value.trim(),
      note: document.getElementById('note-data').value.trim()
    });
  });
}