const db = firebase.database();

const cardsElement = document.querySelector('#app');

let googleUser;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUser = user;
      getNotes(googleUser.uid)
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
        cardsElement.innerHTML += createCard(note)
    }
};

const createCard = (note) => {
    return `
        <div class="column is-one-quarter">
            <div class="card">
                <div class="card-header">
                    <p class="card-header-title">${note.title}</p>
                </div>
                <div class="card-content">
                    <div class="content">
                        <p>${note.text}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
};