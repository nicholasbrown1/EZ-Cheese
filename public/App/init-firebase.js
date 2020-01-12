(function() {
  const firebaseConfig = {
    apiKey: "AIzaSyDIDZpSKYRzJtud1oPeyCQ4RE1wmkuRaNM",
    authDomain: "ez-cheese-58340.firebaseapp.com",
    databaseURL: "https://ez-cheese-58340.firebaseio.com",
    projectId: "ez-cheese-58340",
    storageBucket: "ez-cheese-58340.appspot.com",
    messagingSenderId: "366428189668",
    appId: "1:366428189668:web:f115ca2a630b4863df4df1",
    measurementId: "G-E2HPS79MLK"
  };

  firebase.initializeApp(firebaseConfig);

  const btnLogout = document.getElementById('btnLogout');

  btnLogin.addEventListener('click', e => {
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();

    const promise = auth.signInWithEmailAndPassword(email, pass);

    promise.catch(e => console.log(e.message));
  });

  btnSignUp.addEventListener('click', e => {
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();

    const promise = auth.createUserWithEmailAndPassword(email, pass);

    promise.catch(e => console.log(e.message));
  });

  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
        document.location.href = "../userPage.html";
    }
  });


}());