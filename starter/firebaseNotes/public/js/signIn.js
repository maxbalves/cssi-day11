const emailElement = document.querySelector('#email-input');
const passwordElement = document.querySelector('#password-input');

const signInButton = document.querySelector("#sign-in-btn");

const signInGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;

            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // ...
            window.location = "writeNote.html";
        }).catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
            let err = {
                errorCode,
                errorMessage,
                email,
                credential
            };
            console.log("Something went wrong...");
            console.log(err);
        });
};

const signIn = () => {
    let email = emailElement.value;
    let password = passwordElement.value;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            var user = userCredential.user;
            window.location = 'writeNote.html';
        }).catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
            let err = {
                errorCode,
                errorMessage,
                email,
                credential
            };
            console.log("Something went wrong...");
            console.log(err);
            alert(errorMessage);
        });
};

emailElement.addEventListener('keypress', (e) => {
    if(e.key == "Enter"){
        signInButton.click();
    }
})

passwordElement.addEventListener('keypress', (e) => {
    if(e.key == "Enter"){
        signInButton.click();
    }
})