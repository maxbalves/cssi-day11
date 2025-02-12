const db = firebase.database();

const cardsElement = document.querySelector('#app');
const colorsTextElement = document.querySelector('#randomColors');

const editNoteId = document.querySelector('#editNoteId');
const editModal = document.querySelector('#editModal');
const titleInput = document.querySelector('#titleInput');
const textInput = document.querySelector('#textInput');

const deleteModal = document.querySelector('#deleteModal');
const deleteNoteId = document.querySelector('#deleteNoteId');
const deleteBtn = document.querySelector('#delete-btn');

const labelInputElement = document.querySelector('#label-input');
const showLabelsElement = document.querySelector('#labels');
let labels_arr = [];

let isRandomColors = true;  // by default, cards have random colors

let User;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log(user);
      User = user;
      getNotes(User.uid)
    } else {
      window.location = 'index.html'; // If not logged in, navigate back to login page.
    }
  });
};

const getNotes = (uid) => {
    const notesRef = db.ref(`users/${uid}`);
    notesRef.on('value', (snapshot) => {
        cardsElement.innerHTML = '';  // in case DB changes, we refresh the whole cardsElement to prevent duplicates
        renderDataAsHtml(snapshot.val());
    });
};

const renderDataAsHtml = (data) => {
    for(key in data){
        const note = data[key];
        let shouldCreate = true;
        if(labels_arr.length != 0){        
            shouldCreate = filterByLabels(note);
        }
        if(shouldCreate){
            cardsElement.innerHTML += createCard(note, key)
        }
    }
};

const filterByLabels = (note) => {
    let r = false;
    for(label of labels_arr){
        for(key in note.labels){
            if(note.labels[key].toLowerCase() == label.toLowerCase()){
                r = true;
            }
        }
    }
    return r;
};

const createCard = (note, noteId) => {
    let name = checkUserName();

    if(isRandomColors == true){
        let randomColor = Math.floor(Math.random()*16777215).toString(16);
        return `
            <div class="column is-one-quarter">
                <div class="card" style="background-color:#${randomColor};">
                    <div class="card-header">
                        <p class="card-header-title">${note.title}</p>
                        <p class="card-header-title">By ${name}</p>
                    </div>
                    <div class="card-content">
                        <div class="content">
                            <p>${note.text}</p>
                        </div>
                    </div>
                    <div class="card-footer">
                        <a href="#" class="card-footer-item" onclick="editNote('${noteId}')">Edit</a>
                        <a href="#" class="card-footer-item" onclick="confirmDeleteModal('${noteId}')">Delete</a>
                    </div>
                </div>
            </div>
        `;
    } else {
        return `
            <div class="column is-one-quarter">
                <div class="card">
                    <div class="card-header">
                        <p class="card-header-title">${note.title}</p>
                        <p class="card-header-title">By ${name}</p>
                    </div>
                    <div class="card-content">
                        <div class="content">
                            <p>${note.text}</p>
                        </div>
                    </div>
                    <div class="card-footer">
                        <a href="#" class="card-footer-item" onclick="editNote('${noteId}')">Edit</a>
                        <a href="#" class="card-footer-item" onclick="confirmDeleteModal('${noteId}')">Delete</a>
                    </div>
                </div>
            </div>
        `;
    }
};

const confirmDeleteModal = (noteId) => {
    deleteModal.classList.add('is-active');
    deleteNoteId.value = noteId;
};

const deleteNote = () => {
    console.log('deleting note');
    let noteId = deleteNoteId.value;
    const noteToDeleteRef = db.ref(`users/${User.uid}/${noteId}`);
    noteToDeleteRef.remove();
    closeDeleteModal();
};

const closeDeleteModal = () => {
    deleteModal.classList.remove('is-active');
};

const editNote = (noteId) => {
    console.log('editing note');
    db.ref(`users/${User.uid}/${noteId}`).on('value', (snapshot) => {
        let data = snapshot.val();
        titleInput.value = data.title;
        textInput.value = data.text;
    });
    editNoteId.value = noteId;
    editModal.classList.add('is-active');
};

const closeEditModal = () => {
    editModal.classList.remove('is-active');
};

const saveEditedNote = () => {
    console.log('save');
    const noteId = editNoteId.value;
    const noteRef = db.ref(`users/${User.uid}/${noteId}`)

    let title = titleInput.value;
    let text = textInput.value;

    noteRef.update({
        title: title,
        text: text
    });

    closeEditModal();
}

const checkUserName = () => {
    let n = User.displayName;
    if(n == null){
        n = User.email.split('@')[0];
    } else {
        n = n.split(' ')[0];
    }
    return n;
};

const randomColors = () => {
    isRandomColors = !isRandomColors;
    getNotes(User.uid);

    if(isRandomColors == true){
        colorsTextElement.innerHTML = "Turn Off Random Colors";
    } else {
        colorsTextElement.innerHTML = "Turn On Random Colors";
    }
};

labelInputElement.addEventListener('change', (e) => {
    labels_arr.push(labelInputElement.value);
    labelInputElement.value = '';

    showLabelsElement.innerHTML += `<kbd class="has-background-info-light">${labels_arr[labels_arr.length-1]}</kbd>`;
    getNotes(User.uid);
});