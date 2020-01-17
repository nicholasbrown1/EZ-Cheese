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
  var reader, UserId, friends = [];
  var imageCol = "Images", friendCol = "Users", statusCol = "Statuses", displayNameCol = "DisplayNames", alternateStorageCol = "AlternateStorage";
  var imageField = "base64", friendField = "friends", statusField = "status", displayNameField = "name";
  var alternateStorageFields = ["0", "1", "2", "3","4","5","6","7","8","9","10"];

  var db = firebase.firestore();
  const logoutBtn = document.getElementById('logoutBtn');
  const statusBtn = document.getElementById("statusBtn");
  const addFriendBtn = document.getElementById("addFriendBtn");
  const picUploadBtn = document.getElementById("picUploadBtn");
  const statusInput = document.getElementById("statusInput");
  const addFriendInput = document.getElementById("addFriendInput");
  const picInput = document.getElementById("picInput");
  const userImg = document.getElementById("userImg");
  const userImgLabel = document.getElementById("userImgLabel");
  const uidLabel = document.getElementById("uidLabel");
  const displayNameLabel = document.getElementById("displayNameLabel");
  const changeImgLabel = document.getElementById("changeImgLabel");
  function loadImg(img) {
    for(var i = 0; i < alternateStorageFields.length; i++){
      db.collection(alternateStorageCol).doc(UserId + alternateStorageFields[i]).get().then(function (doc) {
        if(doc.exists) {
          img += doc.data()[imageField];
        } else {
          userImg.src = img;
        }
      });
  }
}

  function runPage(user) {
    UserId = user.uid;
    uidLabel.innerHTML = "UID: " + user.uid;
    uidLabel.classList.remove("hide");

    checkDatabase(db, imageCol, UserId, function(doc) {
      img = doc.data()[imageField];
      if(img) {
        loadImg(img);
        changeImgLabel.classList.remove("hide");
      }
      userImgLabel.innerHTML = img ? "Your Image" : "Upload An Image";
    });

    checkDatabase(db, statusCol, UserId, function(doc) {
      caption = doc.data()[statusField]
      if (caption) {
        userImgLabel.innerHTML = caption;
      }
    });

    checkDatabase(db, displayNameCol, UserId, function(doc) {
        displayNameLabel.innerHTML = "Welcome " + doc.data()[displayNameField] + "!";
        displayNameLabel.classList.remove("hide");
    })

    checkDatabase(db, friendCol, UserId, function (doc) {
      friends = doc.data()[friendField];
    });
  }

  function readImage(blob) {
    var reader = new FileReader();
    reader.readAsDataURL(blob);
    return reader
  }

  function processLargeImage(pic) {
    setDatabase(db, imageCol, UserId, {base64:pic.slice(0,1000000)});
    pic = pic.slice(1000000);
    count = 0;
    while(pic.length > 0 && count < alternateStorageCol.length - 1){
      picInfo = {};
      if(pic.length > 1000000){
        setDatabase(db, alternateStorageCol, UserId+alternateStorageFields[count], {base64:pic.slice(0,1000000)});
        pic = pic.slice(1000000);
      } else {
        setDatabase(db, alternateStorageCol, UserId+alternateStorageFields[count], {base64:pic.slice(0,pic.length)});
        pic=""
      }
      count++;
    }
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

  statusBtn.addEventListener("click", () => {
      val = statusInput.value;
      statusInput.value = "";
      userImgLabel.innerHTML = val;
      setDatabase(db, "Statuses", UserId, {status:val});
    });

  addFriendBtn.addEventListener("click", ()=> {
    val = addFriendInput.value
    addFriendInput.value = "";
    if (!friends.includes(val)){
        checkDatabase(db, imageCol, val, function (doc) {
            friends.push(val);
            setDatabase(db, friendCol, UserId, {friends:friends});
      });
    }
  });

  picUploadBtn.addEventListener("click", ()=> {
    var pic = reader.result;
    picInput.value = null;
    picUploadBtn.classList.add("hide");
    userImg.src = pic;
    for(var i = 0; i < alternateStorageFields.length-1;i++){
      db.collection(alternateStorageCol).doc(UserId+alternateStorageFields[i]).delete();
    }
    if (pic.length > 1000000){
      processLargeImage(pic);
    } else {
      setDatabase(db, imageCol, UserId, {base64:pic});
    }
  });

  picInput.addEventListener("change", ()=> {
    if (event.target.files.length > 0){
      reader = readImage(event.target.files[0]);
      picUploadBtn.classList.remove("hide");
    } else {
      picUploadBtn.classList.add("hide");
    }
  });
})();