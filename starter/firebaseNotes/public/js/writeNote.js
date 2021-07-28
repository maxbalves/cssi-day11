const dbRef = firebase.database().ref();

let googleUser;

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
            console.log(`Logged in as ${user.displayName}`);
            googleUser = user;
            welcomeName.innerHTML = `Hey ${googleUser.displayName.split(' ')[0]},`; // splits the string to show first name
        } else {
            window.location = "index.html";
        }
    });
};

const handleNoteSubmit = () => {
    dbRef.push({
        title: noteTitle.value,
        text: noteText.value,
        labels: labels_arr,
        created: Date()
    });

    noteTitle.value = '';
    noteText.value = '';
    labels_arr = [];
    showLabels.innerHTML = '';
};

submitBtn.addEventListener('click', (e) => {
    handleNoteSubmit();
});

noteLabel.addEventListener('change', (e) => {
    labels_arr.push(noteLabel.value);
    noteLabel.value = '';

    showLabels.innerHTML = `<kbd class="has-background-info-light">${labels_arr[labels_arr.length-1]}</kbd>` + showLabels.innerHTML
});