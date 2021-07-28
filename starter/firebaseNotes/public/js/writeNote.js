const db = firebase.database();

let User;

const welcomeName = document.querySelector('#name-title');
const noteTitle = document.querySelector('#noteTitle');
const noteText = document.querySelector('#noteText');
const noteLabel = document.querySelector('#noteLabel');
const showLabels = document.querySelector('#labels');
let labels_arr = [];

const submitBtn = document.querySelector('#submit-btn');

// When the page loads, we check if the user is signed in or not
// If not, go back to index.html
window.onload = (event) => {
    // gives us the object with all user info or NULL
    firebase.auth().onAuthStateChanged((user) => {
        if(user){
            User = user;
            let name = checkUserName();
            welcomeName.innerHTML = `Hey ${name},`; // splits the string to show first name
        } else {
            window.location = "index.html";
        }
    });
};

const checkUserName = () => {
    let n = User.displayName;
    if(n == null){
        n = User.email.split('@')[0];
    } else {
        n = n.split(' ')[0];
    }
    return n;
}

const handleNoteSubmit = () => {
    const note = {
        title: noteTitle.value,
        text: noteText.value,
        labels: labels_arr,
        created: Date()
    };

    db.ref(`users/${User.uid}`).push(note)
        .then(() => {
            noteTitle.value = '';
            noteText.value = '';
            labels_arr = [];
            showLabels.innerHTML = '';
        });
};

noteLabel.addEventListener('change', (e) => {
    labels_arr.push(noteLabel.value);
    noteLabel.value = '';

    showLabels.innerHTML = `<kbd class="has-background-info-light">${labels_arr[labels_arr.length-1]}</kbd>` + showLabels.innerHTML
});