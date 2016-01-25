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
    var request = tx.get(id);
    request.onsuccess = function (e) {
        var parts = request.result.parts;
        var t2 = db.transaction(["newTable"], "readwrite");
        var request2 = t2.objectStore("newTable").delete(id);
        request.onerror = function (e) {
            console.log(e);
        }
        var r2 = [];
        var tx = [];
        var cont = 0;
        if (parts>1) {
            for (var i = 0; i < parts; i++) {
                tx[i] = db.transaction(["newTable"], "readwrite");
                r2[i] = tx[i].objectStore("newTable").delete(id+'-'+i);
                r2[i].onsuccess = function(e) {
                    cont++;
                    if (cont == parts-1)
                        self.postMessage({type: 'finish'});
                }
                r2[i].onerror = function(e) {
                }
            }
        }
        request2.onsuccess = function(e) {
            if (parts == 1)
                self.postMessage({type: 'finish'});
        }
    }
    request.onerror = function(e) {
    }
}, false);