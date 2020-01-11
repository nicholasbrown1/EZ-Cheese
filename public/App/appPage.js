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
  const usr = document.getElementById("usr")


  btnLogout.addEventListener('click', e => {
    firebase.auth().signOut();
  });

  firebase.auth().onAuthStateChanged(firebaseUser => {
      console.log("hi");
      if (!firebaseUser){
        document.location.href = "../index.html";
      } else {
          showName(firebaseUser);
      }
  });

  function showName(firebaseUser) {
      usr.classList.remove("hide");
      usr.innerHTML = firebaseUser.providerData[0].uid;
  }

}());