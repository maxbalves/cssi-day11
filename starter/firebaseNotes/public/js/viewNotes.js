const db = firebase.database();

const cardsElement = document.querySelector('#app');
const colorsTextElement = document.querySelector('#randomColors');

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
        cardsElement.innerHTML += createCard(note)
    }
};

const createCard = (note) => {
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
                </div>
            </div>
        `;
    }
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

const randomColors = () => {
    isRandomColors = !isRandomColors;
    getNotes(User.uid);

    if(isRandomColors == true){
        colorsTextElement.innerHTML = "Turn Off Random Colors";
    } else {
        colorsTextElement.innerHTML = "Turn On Random Colors";
    }
}