const emailElement = document.querySelector('#email-input');
const passwordElement = document.querySelector('#password-input');

const submitButton = document.querySelector('#sign-up-btn');

const signUp = () => {
    let email = emailElement.value;
    let password = passwordElement.value;
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            var user = userCredential.user;
            emailElement.value = '';
            passwordElement.value = '';
            window.location = '/index.html';
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            let err = {
                errorCode,
                errorMessage
            };
            alert(errorMessage);
            console.log(err);
        });
};

emailElement.addEventListener('keypress', (e) => {
    if(e.key == "Enter"){
        submitButton.click();
    }
})

passwordElement.addEventListener('keypress', (e) => {
    if(e.key == "Enter"){
        submitButton.click();
    }
})