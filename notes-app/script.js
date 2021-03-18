const addNoteEl = document.getElementById("add-note");
const saveNotesEl = document.getElementById("save-notes");
const deleteNotesEl = document.getElementById("delete-notes");
const notesEl = document.getElementById("notes");
const noNotesEl = document.getElementById("no-notes");

let notes = [];

addNoteEl.addEventListener("click", () => {
  let note = {
    id: getid(20),
    name: "Note Name",
    content: "Note Content",
  };
  notes.unshift(note);
  const noteEl = addNote(note);
  notesEl.prepend(noteEl);
  toggleHeaderButtons();
});

deleteNotesEl.addEventListener("click", () => {
  emptyLS();
  notesEl.innerHTML = "";
  toggleHeaderButtons();
});

saveNotesEl.addEventListener("click", () => {
  const notesList = document.querySelectorAll(".note");
  if (notesList.length > 0) {
    notes = [];
    setLS();
    Array.from(notesList, (noteItem) => {
      let noteId = noteItem.getElementsByClassName("note-content")[0].id;
      let noteName = noteItem.getElementsByClassName("note-name")[0].innerText;
      let noteContent = noteItem.getElementsByClassName("note-content")[0]
        .innerText;
      let note = {
        id: noteId,
        name: noteName,
        content: noteContent,
      };
      notes.unshift(note);
    });
    setLS();
  }
  toggleHeaderButtons();
});

function addNote(note) {
  const noteEl = document.createElement("article");
  noteEl.classList.add("note");
  noteEl.innerHTML = `
    <div class="note-header">
        <div onkeyup="checkLimit(this)" class="note-name" type="text" name="note-name" contentEditable="true">${note.name}</div>
        <div class="buttons">
            <button title="Save" class="note-buttons" onclick="saveNote(this)"><i class="far fa-save"></i>Save</button>
            <button title="Preview" class="note-buttons" onclick="previewNote(this)"><i class="far fa-file-alt"></i>Preview</button>
            <button title="Edit" class="note-buttons disable" onclick="editNote(this)" disabled><i class="far fa-file-code"></i>Edit</button>
            <button title="Delete" class="note-buttons" onclick="deleteNote(this)"><i class="fas fa-times"></i>Delete</button>    
            </div>
    </div>
    <div class="note-content" contenteditable="true" id=${note.id}>${note.content}</div>
    `;
  return noteEl;
}

function checkLimit(e) {
  if (e.innerText.length >= 50) {
    e.innerText = e.innerText.slice(0, 50);
  }
  if (e.innerText.length == 0) {
    e.innerText = "Note Name";
  }
}

function saveNote(e) {
  let noteExists = false;
  let curNoteId = e.parentNode.parentNode.nextElementSibling.id;
  let curNoteName = e.parentNode.previousElementSibling.innerText;
  let curNoteContent = e.parentNode.parentNode.nextElementSibling.innerText;
  notes = notes.map((note) => {
    if (note.id == curNoteId) {
      noteExists = true;
      note.name = curNoteName;
      note.content = curNoteContent;
    }
    return note;
  });
  if (!noteExists) {
    let note = {
      id: curNoteId,
      name: curNoteName,
      content: curNoteContent,
    };
    notes.unshift(note);
  }
  setLS();
  toggleHeaderButtons();
}

function previewNote(e) {
  e.classList.toggle("disable");
  e.previousElementSibling.classList.toggle("disable");
  e.previousElementSibling.disabled = false;
  e.nextElementSibling.classList.toggle("disable");
  e.nextElementSibling.disabled = false;
  e.disabled = true;
  e.parentNode.previousElementSibling.setAttribute("contenteditable", false);
  e.parentNode.parentNode.nextElementSibling.setAttribute(
    "contenteditable",
    false
  );
  e.parentNode.parentNode.nextElementSibling.classList.toggle("preview-note");
  let noteId = e.parentNode.parentNode.nextElementSibling.id;
  notes.map((note) => {
    if (note.id == noteId) {
      note.name = e.parentNode.previousElementSibling.innerText;
      note.content = e.parentNode.parentNode.nextElementSibling.innerText;
    }
    return note;
  });
  let htmlText = parseMarkdown(
    e.parentNode.parentNode.nextElementSibling.innerText
  );
  e.parentNode.parentNode.nextElementSibling.innerHTML = htmlText;
}

function editNote(e) {
  e.classList.toggle("disable");
  e.previousElementSibling.previousElementSibling.classList.toggle("disable");
  e.previousElementSibling.previousElementSibling.disabled = false;
  e.previousElementSibling.classList.toggle("disable");
  e.previousElementSibling.disabled = false;
  e.disabled = true;
  e.parentNode.previousElementSibling.setAttribute("contenteditable", true);
  e.parentNode.parentNode.nextElementSibling.setAttribute(
    "contenteditable",
    true
  );
  e.parentNode.parentNode.nextElementSibling.classList.toggle("preview-note");
  let noteId = e.parentNode.parentNode.nextElementSibling.id;
  let currentNote = notes.filter((note) => {
    if (note.id == noteId) return true;
    return false;
  });
  let noteName = currentNote[0].name;
  let noteContent = currentNote[0].content;
  e.parentNode.previousElementSibling.innerText = noteName;
  e.parentNode.parentNode.nextElementSibling.innerText = noteContent;
}

function deleteNote(e) {
  e.parentNode.parentNode.parentNode.remove();
  let curNoteId = e.parentNode.parentNode.nextElementSibling.id;
  notes = notes.filter((note) => {
    if (note.id == curNoteId) {
      return false;
    }
    return true;
  });
  setLS();
  toggleHeaderButtons();
}

function getid(length) {
  let id = "";
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charsLength = chars.length;
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * charsLength));
  }
  return id;
}

function setLS() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function getLS() {
  return JSON.parse(localStorage.getItem("notes"));
}

function emptyLS() {
  notes = [];
  localStorage.removeItem("notes");
  toggleHeaderButtons();
}

document.addEventListener("DOMContentLoaded", function () {
  loadFromLS();
  toggleHeaderButtons();
});

function loadFromLS() {
  let notesData = getLS();
  if (notesData) {
    notes = notesData;
    notes.map((note) => {
      const noteEl = addNote(note);
      notesEl.append(noteEl);
    });
  }
}
function toggleHeaderButtons() {
  if (notes.length > 0) {
    saveNotesEl.disabled = false;
    saveNotesEl.classList.remove("disable");
    deleteNotesEl.disabled = false;
    deleteNotesEl.classList.remove("disable");
    noNotesEl.classList.add("display-none");
  } else {
    saveNotesEl.disabled = true;
    saveNotesEl.classList.add("disable");
    deleteNotesEl.disabled = true;
    deleteNotesEl.classList.add("disable");
    noNotesEl.classList.remove("display-none");
  }
  toggleNoNotes();
}

function toggleNoNotes() {
  if (notes.length > 0) {
    noNotesEl.classList.add("display-none");
  } else {
    noNotesEl.classList.remove("display-none");
  }
}

function parseMarkdown(markdownText) {
  const htmlText = markdownText
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/^\> (.*$)/gim, "<blockquote>$1</blockquote>")
    .replace(/\*\*(.*)\*\*/gim, "<b>$1</b>")
    .replace(/\*(.*)\*/gim, "<i>$1</i>")
    .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
    .replace(/\n$/gim, "<br />");
  return htmlText.trim();
}
