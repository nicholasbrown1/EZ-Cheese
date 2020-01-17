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
  var db = firebase.firestore();

  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const emailInput = document.getElementById("emailInput");
  const passwordInput = document.getElementById("passwordInput");

  loginBtn.addEventListener('click', e => {
    const email = emailInput.value;
    const pass = passwordInput.value;
    const auth = firebase.auth();

    const promise = auth.signInWithEmailAndPassword(email, pass);

    promise.catch(e => console.log(e.message));
  });

  passwordInput.addEventListener('keydown', e=> {
    if(e.keyCode === 13) {
      loginBtn.click();
    }
  })

  signupBtn.addEventListener('click', e => {
    const email = emailInput.value;
    const pass = passwordInput.value;
    const auth = firebase.auth();

    const promise = auth.createUserWithEmailAndPassword(email, pass);

    promise.catch(e => console.log(e.message));
  });

  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      db.collection("DisplayNames").doc(firebaseUser.uid).get().then(function (doc) {
      if(doc.exists) {
        document.location.href = "../profile.html";
      } else {
        document.location.href = "../displayName.html";
      }
      });
    }
  });
}());