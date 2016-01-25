( function () {

	var ser = angular.module('Db', []);

	ser.factory('db', ['$window', '$q', 'deviceDetector', function ($window, $q, deviceDetector) {

		var reports = {};

		var saveTable = function (table, size) {
			console.log(table, size);
			var deferred = $q.defer();
			checkTable(table.reportId).then(function (exist) {
				if (exist) {
					deleteTable(table.reportId).then(function (exist) {
						if (deviceDetector.browser == 'chrome') {
							var worker = new Worker('js/workers/save_table.js');
						    worker.addEventListener('message', function(e) {
						    	switch (e.data.type) {
						    		case 'ready':
						    			worker.postMessage({table: table, size: size});
						    			break;
						    		case 'finish':
						    			worker.terminate();
						    			deferred.resolve();
						    			break;
						    		case 'error':
						    			console.log(e);
						    			console.log(e.data.comment);
						    			console.log(e.data.error);
						    			break;
						    		default:
						    			break;
						    	}
					      	}, false);
						}else{
							mozSave(table, size, function () {
								deferred.resolve();
							});
						}
					});
				}else{
					if (deviceDetector.browser == 'chrome') {
						var worker = new Worker('js/workers/save_table.js');
					    worker.addEventListener('message', function(e) {
					    	switch (e.data.type) {
					    		case 'ready':
					    			worker.postMessage({table: table, size: size});
					    			break;
					    		case 'finish':
					    			worker.terminate();
					    			deferred.resolve();
					    			break;
					    		case 'error':
					    			console.log(e);
					    			console.log(e.data.comment);
					    			console.log(e.data.error);
					    			break;
					    		default:
					    			break;
					    	}
				      	}, false);
					}else{
						mozSave(table, size, function () {
							deferred.resolve();
						});
					}
				}
			});

		    return deferred.promise;
		}

		var getTable = function (id) {
			var worker;
			var deferred = $q.defer();
			if (reports[id]) {
				deferred.resolve(reports[id]);
			}else{
				if (deviceDetector.browser == 'chrome') {
				    worker = new Worker('js/workers/get_table.js');
				    worker.addEventListener('message', function(e) {
				    	switch (e.data.type) {
				    		case 'ready':
				    			worker.postMessage(id);
				    			break;
				    		case 'table':
				    			worker.terminate();
				    			if (e.data.save)
				    				reports[id] = JSON.parse(JSON.stringify(e.data.data));
				    			deferred.resolve(e.data.data);
				    			break;
				    	}
			      	}, false);
				}else{
					mozGet(id, function (data) {
						deferred.resolve(data);
					});
				}
			}

	      	return deferred.promise;
		}

		var deleteTable = function (id) {
			var deferred = $q.defer();
			delete reports[id];
			if (deviceDetector.browser == 'chrome') {
				var worker = new Worker('js/workers/delete_table.js');
			    worker.addEventListener('message', function(e) {
			    	switch (e.data.type) {
			    		case 'ready':
			    			worker.postMessage(id);
			    			break;
			    		case 'finish':
			    			console.log('borra ok');
			    			worker.terminate();
			    			deferred.resolve();
			    			break;
			    	}
		      	}, false);
			}else{
				mozDelete(id);
			}
			return deferred.promise;
		}

		var checkTable = function (id) {
			var deferred = $q.defer();
			if (deviceDetector.browser == 'chrome') {
				var worker = new Worker('js/workers/check_table.js');
				worker.addEventListener('message', function(e) {
	    	    	switch (e.data.type) {
	    	    		case 'ready':
	    	    			worker.postMessage(id);
	    	    			break;
	    	    		case 'finish':
	    	    			worker.terminate();
	    	    			deferred.resolve(e.data.data);
	    	    	}
	          	}, false);
	        }else{
	        	mozCheck(id, function (data) {
	        		deferred.resolve(data);
	        	});
	        }
          	return deferred.promise;
		}

		var mozGet = function (id, callback) {
			var indexedDB = $window.indexedDB;
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
				var tx = db.transaction(["newTable"], "readonly").objectStore("newTable");
				var request = tx.get(id);
				request.onsuccess = function(e) {
				    if (request.result.parts == 1) {
				        callback(request.result);
				        db.close();
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
				                        callback(request.result);
				                        db.close();
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
			};

			request.onerror = function () {

			};
		}

		var mozSave = function (table, size, callback) {
			var indexedDB = $window.indexedDB;
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

			var saveMiniTable = function (table, callback) {
			    var transaction = db.transaction(["newTable"],"readwrite");
			    var store = transaction.objectStore("newTable");
			    var request = store.add(table);
			    request.onerror = function(e) {
			        console.log(e);
			    }
			    request.onsuccess = function(e) {
			        callback();
			    }
			}

			request.onsuccess = function (e) {
				db = e.target.result;
				var cont = 0;
				var transaction = db.transaction(["newTable"],"readwrite");
				var store = transaction.objectStore("newTable");
				var aux = {};
				if (size < 50) {
				   table.parts = 1;
				   var request = store.add(table);
				   request.onerror = function(e) {
				       console.log(e);
				   }

				   request.onsuccess = function(e) {
				   		db.close();
				       callback();
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
				           if (cont == (cuts+1)) {
				           		db.close();
				           		callback();
				           }
				       });
				   };
				   table.parts = cuts;
				   var request = store.add(table);
				   request.onerror = function(e) {
				   }

				   request.onsuccess = function(e) {
				       cont++;
				       if (cont == (cuts+1)) {
				       		db.close()
				       		callback();
				       }
				   }
				}
			};

			request.onerror = function () {

			};
		}

		var mozDelete = function (id) {
			var indexedDB = $window.indexedDB;
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
			       for (var i = 0; i < parts; i++) {
			           tx[i] = db.transaction(["newTable"], "readwrite");
			           r2[i] = tx[i].objectStore("newTable").delete(id+'-'+i);
			           r2[i].onsuccess = function(e) {
			               cont++;
			               if (cont == parts-1)
			                   db.close()
			           }
			           r2[i].onerror = function(e) {
			           }
			       }
			   }
			   request.onerror = function(e) {
			   }
			};

			request.onerror = function () {

			};
		}

		var mozCheck = function (id, callback) {
			var indexedDB = $window.indexedDB;
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
			   var id = e.data;
			   var tx = db.transaction(["newTable"], "readonly").objectStore("newTable");
			   var request = tx.count(id);
			   request.onsuccess = function(e) {
			       if (request.result) {
			       		callback(true);
			       		db.close();
			       }else{
			       		callback(false);
			       		db.close();
			       }
			   }
			   request.onerror = function() {
			       	callback(false);
		       		db.close();
			   }
			};

			request.onerror = function () {

			};
		}

		return {
			saveTable: saveTable,
			deleteTable: deleteTable,
			getTable: getTable,
			checkTable: checkTable
		}
	}]);

})();