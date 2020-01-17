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
  var reader, UserId, friends = [], idx=0;
  var imageCol = "Images", friendCol = "Users", statusCol = "Statuses";
  var imageField = "base64", friendField = "friends", statusField = "status";


  const logoutBtn = document.getElementById('logoutBtn');
  const addFriendBtn = document.getElementById("addFriendBtn");
  const forwardBtn = document.getElementById("forwardBtn");
  const statusBtn = document.getElementById("statusBtn");
  const picUploadBtn = document.getElementById("picUploadBtn");
  const backwardBtn = document.getElementById("backwardBtn");
  const picInput = document.getElementById("picInput");
  const addFriendInput = document.getElementById("addFriendInput");
  const statusInput = document.getElementById("statusInput");
  const friendImg = document.getElementById("friendImg");
  const userImg = document.getElementById("userImg");
  const uidLabel = document.getElementById("uidLabel");
  const userImgLabel = document.getElementById("userImgLabel");
  const friendImgLabel = document.getElementById("friendImgLabel")

  function runPage(user) {
    UserId = user.uid;
    uidLabel.innerHTML = "UID: " + user.uid;
    uidLabel.classList.remove("hide");

    checkDatabase(db, imageCol, UserId, function(doc) {
      img = doc.data()[imageField];
      if(img) {
        userImg.src = img;
      }
      userImgLabel.innerHTML = img ? "Your Image" : "Upload An Image";
    });

    checkDatabase(db, statusCol, UserId, function(doc) {
      caption = doc.data()[statusField]
      if (caption) {
        userImgLabel.innerHTML = caption;
      }
    });

    checkDatabase(db, friendCol, UserId, function (doc) {
      friends = doc.data()[friendField];
      if (friends.length > 0) {
        showFriendPhoto();
      }
    });

    addChecker(db, imageCol, UserId, function (doc) {
      userImg.src = doc.data()[imageField];
    });

    addChecker(db, statusCol, UserId, function (doc) {
      userImgLabel.innerHTML = doc.data()[statusField];
    })
  }

  function readImage(blob) {
    var reader = new FileReader();
    reader.readAsDataURL(blob);
    return reader
  }

  function showFriendPhoto(){
    if (idx >= friends.length){
      idx = 0;
    }

    if (idx < 0) {
      idx = friends.length - 1;
    }

    checkDatabase(db, imageCol, friends[idx], function (doc) {
        img = doc.data()[imageField];
        if (img) {
          friendImg.src = img;
        }
    });

    checkDatabase(db, statusCol, friends[idx], function(doc) {
        caption = doc.data()[statusField];
        if (caption) {
          friendImgLabel.innerHTML = caption;
        } else {
          friendImgLabel.innerHTML = "Friend Image";
        }
    });

    addChecker(db, imageCol, friends[idx], function (doc) {
      friendImg.src = doc.data()[imageField];
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
    val = addFriendInput.value;
    firebase.auth().signOut();
  });

  statusBtn.addEventListener("click", () => {
    val = statusInput.value;
    statusInput.value = "";
    setDatabase(db, "Statuses", UserId, {status:val});
  });

  addFriendBtn.addEventListener("click", ()=> {
    val = addFriendInput.value
    addFriendInput.value = "";
    if (!friends.includes(val)){
      checkDatabase(db, imageCol, val, function (doc) {
        friends.push(val);
        setDatabase(db, friendCol, UserId, {friends:friends});
        showFriendPhoto();
      });
    }
  });

  forwardBtn.addEventListener("click", () => {
    idx++;
    showFriendPhoto();
  });

  backwardBtn.addEventListener("click", () => {
    idx--;
    showFriendPhoto();
  });

  picUploadBtn.addEventListener("click", () => {
    var pic = reader.result;
    setDatabase(db, imageCol, UserId, {base64:pic});
  });
    
  picInput.addEventListener("change", event => {
    if (event.target.files.length > 0){
      reader = readImage(event.target.files[0]);
      picUploadBtn.classList.remove("hide");
    } else {
      picUploadBtn.classList.add("hide");
    }
  });
})();