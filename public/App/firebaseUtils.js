function checkDatabase(db, col, name, func) {
    if (name == ""){
        return;
    }
    db.collection(col).doc(name).get().then(function (doc) {
    if(doc.exists) {
        func(doc);
    }
    });
}

function setDatabase(db, col, name, obj) {
    db.collection(col).doc(name).set(obj);
}

function addChecker(db, col, name, func) {
    db.collection(col).doc(name).onSnapshot(function(doc) {
        if (doc.exists) {
            func(doc);
        }
    });
}