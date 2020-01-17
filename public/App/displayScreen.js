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

  var UserId;

  firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore();

  const displayInput = document.getElementById("displayInput");
  const enterBtn = document.getElementById("enterBtn");

  firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
      runpage(firebaseUser);
    } else {
      document.location.href = "../index.html";
    }
  });

  displayInput.addEventListener('keydown', e=>{
    if (e.keyCode === 13) {
      enterBtn.click();
    }
  });

  enterBtn.addEventListener("click", ()=> {
    if(displayInput.value != ""){
      setDatabase(db, "DisplayNames", UserId, {name:displayInput.value});
      checkDatabase(db, "DisplayNames", UserId, function(doc) {
        document.location.href = "../profile.html";
    });
    }
  });

  function runpage(user) {
    UserId = user.uid;
  }
})();