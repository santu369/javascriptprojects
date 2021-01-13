const addNoteEl = document.getElementById('add-note');
const notesEl = document.getElementById('notes');

let notes = [];

addNoteEl.addEventListener('click', () => {
    let note = {
        id: getid(20),
        name: "Note Name",
        content: "Note Content"
    };
    console.log(note);
    notes.push(note);
    const noteEl = document.createElement('article');
    noteEl.classList.add('note');
    noteEl.innerHTML = 
    `
    <div class="note-header">
        <div onkeyup="checkLimit(this)" class="note-name" type="text" name="note-name" contentEditable="true">${note.name}</div>
        <div class="buttons">
            <button title="Save" class="save" onclick="saveNote(this)"><i class="far fa-save"></i>Save</button>
            <button title="Preview" class="preview" onclick="previewNote(this)"><i class="far fa-file-alt"></i>Preview</button>
            <button title="Edit" class="edit disable" onclick="editNote(this)"><i class="far fa-file-code"></i>Edit</button>
            <button title="Delete" class="delete" onclick="deleteNote(this)"><i class="fas fa-times"></i>Delete</button>    
            </div>
    </div>
    <div class="note-content" contenteditable="true">${note.content}</div>
    `;
    notesEl.prepend(noteEl);
    // TODO: Add note from local storage
});


function checkLimit(e) {
    if(e.innerText.length >= 50) {
        e.innerText = e.innerText.slice(0,50);
    }
    if(e.innerText.length == 0) {
        e.innerText = "Note Name";
    }
}

function saveNote(e) {
    // TODO: Save note to local storage
}

function previewNote(e) {
    e.classList.toggle("disable");
    e.nextElementSibling.classList.toggle("disable");
    e.parentNode.parentNode.nextElementSibling.setAttribute("contenteditable",false);
    e.parentNode.parentNode.nextElementSibling.classList.toggle("preview-note");
    // TODO: Preview content using markup
    let htmlText = parseMarkdown(e.parentNode.parentNode.nextElementSibling.innerText);
    e.parentNode.parentNode.nextElementSibling.innerHTML = htmlText;
    console.log(htmlText);
}

function editNote(e) {
    e.classList.toggle("disable");
    e.previousElementSibling.classList.toggle("disable");
    e.parentNode.parentNode.nextElementSibling.setAttribute("contenteditable",true);
    e.parentNode.parentNode.nextElementSibling.classList.toggle("preview-note");
    // TODO: Remove preview content using markup
}

function deleteNote(e) {
    e.parentNode.parentNode.parentNode.remove();
    // TODO: Remove note from local storage
}

function getid(length) {
    let id = "";
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charsLength = chars.length;
    for ( let i = 0; i < length; i++ ) {
       id += chars.charAt(Math.floor(Math.random() * charsLength));
    }
    return id;
}

function setLS() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function getLS() {
    return JSON.parse(localStorage.getItem('notes'));
}

document.addEventListener("DOMContentLoaded", function() {
    loadFromLS();
});

function loadFromLS() {
    // TODO: Load notes to UI from local storage
}

function parseMarkdown(markdownText) {
	const htmlText = markdownText
		.replace(/^### (.*$)/gim, '<h3>$1</h3>')
		.replace(/^## (.*$)/gim, '<h2>$1</h2>')
		.replace(/^# (.*$)/gim, '<h1>$1</h1>')
		.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
		.replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
		.replace(/\*(.*)\*/gim, '<i>$1</i>')
		.replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
		.replace(/\n$/gim, '<br />');
	return htmlText.trim();
}