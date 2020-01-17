(function(){
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
  var UserId, friends = [], idx=0;
  var imageCol = "Images", friendCol = "Users", statusCol = "Statuses", displayNameCol = "DisplayNames", alternateStorageCol = "AlternateStorage";
  var imageField = "base64", friendField = "friends", statusField = "status", displayNameField = "name";
  var alternateStorageFields = ["0", "1", "2", "3","4","5","6","7","8","9","10"];

  const logoutBtn = document.getElementById('logoutBtn');
  const forwardBtn = document.getElementById("forwardBtn");
  const backwardBtn = document.getElementById("backwardBtn");
  const friendImg = document.getElementById("friendImg");
  const friendImgLabel = document.getElementById("friendImgLabel");
  const friendDisplayName = document.getElementById("friendDisplayName");

  function loadImg(img) {
    for(var i = 0; i < alternateStorageFields.length; i++){
      db.collection(alternateStorageCol).doc(friends[idx] + alternateStorageFields[i]).get().then(function (doc) {
        if(doc.exists) {
          img += doc.data()[imageField];
        } else {
          friendImg.src = img;
        }
      });
  }
}

  function runPage(user) {
    UserId = user.uid;

    checkDatabase(db, friendCol, UserId, function (doc) {
      friends = doc.data()[friendField];
      if (friends.length > 0) {
        showFriendPhoto();
      }
    });
  }

  function showFriendPhoto(){
    friendDisplayName.classList.add("hide");
    if (idx >= friends.length){
      idx = 0;
    }

    if (idx < 0) {
      idx = friends.length - 1;
    }

    checkDatabase(db, imageCol, friends[idx], function (doc) {
        loadImg(doc.data()[imageField]);
    });

    db.collection(statusCol).doc(friends[idx]).get().then(function (doc) {
        if(doc.exists) {
          friendImgLabel.innerHTML = doc.data()[statusField];
        } else {
          friendImgLabel.innerHTML = "Friend Image";
        }
    });

    db.collection(displayNameCol).doc(friends[idx]).get().then(function (doc) {
      if (doc.exists) {
        friendDisplayName.innerHTML = doc.data()[displayNameField]
        friendDisplayName.classList.remove("hide");
      }
    });

    addChecker(db, imageCol, friends[idx], function (doc) {
      loadImg(doc.data()[imageField]);
    });

    addChecker(db, statusCol, friends[idx], function (doc) {
      friendImgLabel.innerHTML = doc.data()[statusField];
    });
  }

  firebase.auth().onAuthStateChanged(firebaseUser => {
      if (!firebaseUser){
        document.location.href = "../index.html";
      } else {
        runPage(firebaseUser);
      }
  });

  logoutBtn.addEventListener('click', () => {
    firebase.auth().signOut();
  });

  forwardBtn.addEventListener("click", () => {
    idx++;
    showFriendPhoto();
  });

  backwardBtn.addEventListener("click", () => {
    idx--;
    showFriendPhoto();
  });
})();