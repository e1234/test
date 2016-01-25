var indexedDB = self.indexedDB || self.msIndexedDB || self.webkitIndexedDB || self.mozIndexedDB;
var db = null;
var version = 10;
var request = indexedDB.open("tabsData", version);

request.onupgradeneeded = function (e) {
    db = e.target.result;

    e.target.transaction.onerror = indexedDB.onerror;

    if (!db.objectStoreNames.contains("newTable")) {
        db.createObjectStore("newTable", {
            keyPath: "reportId"
        });
    }

};

request.onsuccess = function (e) {
   db = e.target.result;
   self.postMessage({type: 'ready'});
};

request.onerror = function () {

};

self.addEventListener('message', function (e) {
    var id = e.data;
    var tx = db.transaction(["newTable"], "readonly").objectStore("newTable");
    var request = tx.count(id);
    request.onsuccess = function(e) {
        //console.log(e);
        if (request.result)
            self.postMessage({type: 'finish', data: true});
        else
            self.postMessage({type: 'finish', data: false});
    }
    request.onerror = function() {
        self.postMessage({type: 'finish', data: false});
    }
}, false);