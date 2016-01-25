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
    request.onsuccess = function(e) {
        if (request.result.parts == 1) {
            self.postMessage({type: 'table', data: request.result, save: true});
        } else {
            var requests = [];
            var txs = [];
            var data = [];
            var cont = 0;
            for (var i = 0; i < request.result.parts; i++) {
                (function f (i) {
                    txs[i] = db.transaction(["newTable"], "readonly").objectStore("newTable");
                    requests[i] = txs[i].get(request.result.reportId+'-'+i);
                    requests[i].onsuccess = function(e) {
                        data = data.concat(requests[i].result.data);
                        cont++;
                        if (cont == request.result.parts) {
                            request.result.table.data = data;
                            self.postMessage({type: 'table', data: request.result, save: false});
                        }
                    }
                    requests[i].onerror = function(e) {
                        console.log('murio');
                    }
                })(i);
            }
        }
    }
    request.onerror = function(e) {
    }
}, false);