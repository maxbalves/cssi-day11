let dbRef = firebase.database().ref();

let googleUser;

let noteTitle = document.querySelector('#noteTitle');
let noteText = document.querySelector('#noteText');
let welcomeName = document.querySelector('#name-title');

let submitBtn = document.querySelector('#submit-btn');

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
        created: Date()
    });

    noteTitle.value = "";
    noteText.value = "";
};

submitBtn.addEventListener('click', (e) => {
    handleNoteSubmit();
});