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
    self.postMessage({type: 'error', comment: 'Abriendo base', error: e});
};

var saveMiniTable = function (table, callback) {
    var transaction = db.transaction(["newTable"],"readwrite");
    var store = transaction.objectStore("newTable");
    var request = store.add(table);
    request.onerror = function(e) {
        console.log(e);
        self.postMessage({type: 'error', comment: 'Guardando mini tabla', error: e});
    }
    request.onsuccess = function(e) {
        callback();
    }
}

self.addEventListener('message', function (e) {
    var cont = 0;
    var size = e.data.size;
    var table = e.data.table;
    var transaction = db.transaction(["newTable"],"readwrite");
    var store = transaction.objectStore("newTable");
    var aux = {};
    if (size < 50) {
        table.parts = 1;
        var request = store.add(table);
        request.onerror = function(e) {
            console.log(e);
            self.postMessage({type: 'error', comment: 'Guardando tabla chica'});
        }

        request.onsuccess = function(e) {
            self.postMessage({type: 'finish'});
        }
    } else {
        var cuts = Math.ceil(size / 50);
        var data = table.table.data;
        table.table.data = [];
        var cant = Math.round((data.length)/cuts);
        for (var i = 0; i < cuts; i++) {
            aux = {};
            if (i!=(cuts-1)) {
                aux.data = data.splice(0, cant);
            }else{
                aux.data = data.splice(0, data.length);
            }
            aux.reportId = table.reportId+'-'+i;
            saveMiniTable(aux, function () {
                cont++;
                if (cont == (cuts+1))
                    self.postMessage({type: 'finish'});
            });
        };
        table.parts = cuts;
        var request = store.add(table);
        request.onerror = function(e) {
            self.postMessage({type: 'error', comment: 'Guardando cabecera', error: e});
        }

        request.onsuccess = function(e) {
            cont++;
            if (cont == (cuts+1))
                self.postMessage({type: 'finish'});
        }
    }
}, false);