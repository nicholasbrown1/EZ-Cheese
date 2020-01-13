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


  const btnLogout = document.getElementById('btnLogout');
  const usr = document.getElementById("usr")
  const picInput = document.getElementById("imagefile");
  const userImg = document.getElementById("userImage");
  const upload = document.getElementById("upload");
  const userDesc = document.getElementById("userDescription");
  const friendPics = document.getElementById("friendsImage");
  const friendDesc = document.getElementById("friendDesc")
  const forwardbtn = document.getElementById("forward");
  const backwardbtn = document.getElementById("backward");
  const add = document.getElementById("add");
  const addbtn = document.getElementById("addbtn");
  const status = document.getElementById("status");
  const statusbtn = document.getElementById("statusbtn");

  statusbtn.addEventListener("click", () => {
    val = status.value;
    status.value = "";
    db.collection("Statuses").doc(UserId).set({
      status:val
    })
  })

  addbtn.addEventListener("click", ()=> {
    val = add.value;
    add.value = "";
    if (!(friends.includes(val))){
      friends.push (val);
      db.collection("Images").doc(val).get().then(function (doc) {
        if (doc && doc.exists) {
          db.collection("Users").doc(UserId).set({
            friends:friends
          });
        }
      });
      showFriendPhoto();
    }
  })

  forwardbtn.addEventListener("click", () => {
    idx++;
    showFriendPhoto();
  })

  backwardbtn.addEventListener("click", () => {
    idx--;
    showFriendPhoto();
  })

  upload.addEventListener("click", () => {
    var pic = reader.result;
    db.collection("Images").doc(UserId).set({
      base64:pic,
    });


  });
  
  picInput.addEventListener("change", event => {
    if (event.target.files.length > 0){
      reader = readImage(event.target.files[0]);
      upload.classList.remove("hide");
    } else {
      upload.classList.add("hide");
    }
  });


  btnLogout.addEventListener('click', e => {
    firebase.auth().signOut();
  });


  firebase.auth().onAuthStateChanged(firebaseUser => {
      if (!firebaseUser){
        document.location.href = "../index.html";
      } else {
        runPage(firebaseUser)
      }
  });



  function runPage(user) {
    UserId = user.uid;
    usr.innerHTML = "UID: " + user.uid;
    usr.classList.remove("hide");
    db.collection("Images").doc(UserId).get().then(function (doc) {
      if (doc && doc.exists) {
        userImg.src=doc.data().base64;
        userDesc.innerHTML = "Your Image";
      } else {
        userDesc.innerHTML = "Upload An Image";
      }
    });
    db.collection("Statuses").doc(UserId).get().then(function (doc) {
      if (doc && doc.exists) {
        userDesc.innerHTML = doc.data().status;
      }
    });

    db.collection("Users").doc(UserId).get().then(function(doc) {
      if (doc && doc.exists) {
        friends = doc.data().friends;
        if (friends.length > 0){
          showFriendPhoto();
        }
      }
    });

    db.collection("Statuses").doc(UserId)
    .onSnapshot(function(doc) {
      if(doc && doc.exists) {
        userDesc.innerHTML = doc.data().status;
      }
    })
    db.collection("Images").doc(UserId)
    .onSnapshot(function(doc) {
      if(doc && doc.exists){
        userImg.src = doc.data().base64;
      }
    });
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
    db.collection("Images").doc(friends[idx]).get().then(function(doc) {
      if (doc && doc.exists) {
        friendPics.src = doc.data().base64;
      }
    })
    db.collection("Statuses").doc(friends[idx]).get().then(function(doc) {
      if (doc && doc.exists) {
      friendDesc.innerHTML = doc.data().status
      } else {
        friendDesc.innerHTML = "Friend Image"
      }
    })
    db.collection("Statuses").doc(friends[idx])
    .onSnapshot(function(doc) {
      if(doc && doc.exists) {
        friendDesc.innerHTML = doc.data().status;
      }
    })
    db.collection("Images").doc(friends[idx])
    .onSnapshot(function(doc) {
      if(doc && doc.exists){
        friendPics.src = doc.data().base64;
      }
    });
  }