( function () {
	var c=document.createElement('canvas');
	var ctx=c.getContext('2d');
	ctx.font = '12px ' + 'sans-serif';
	String.prototype.visualLength = function()
	{
		return ctx.measureText(this).width + 14;
	}

	var ser = angular.module('modulo_servicios', []);

	ser.factory('facUser', function(){
		this.userData = [];
		return this;
	});

	ser.factory('facMenu', function () {
	  	this.menu = [{
	        	name: 'Home',
	        	icon: 'home',
	        	submenu: [],
	        	selected: false,
	        	code: 0
	        }, {
	        	name: 'Reports (BETA 3)',
	        	icon: 'poll',
	        	selected: false,
	        	code: 1
	        }, {
	        	name: 'Campaigns',
	        	icon: 'person',
	        	submenu: [{
	        		name: 'List',
	        		code: 5
	        	},{
	        		name: 'Create',
	        		code: 3
	        	},{
	        		name: 'Administrate',
	        		code: 4
	        	}],
	        	selected: false,
	        	code: 2
	        }, {
	        	name: 'Referrers',
	        	icon: 'home',
	        	submenu: [],
	        	selected: false,
	        	code: 6
	        }, {
	        	name: 'Publishers',
	        	icon: 'home',
	        	submenu: [],
	        	selected: false,
	        	code: 7
	        }, {
	        	name: 'Advertisers',
	        	icon: 'home',
	        	submenu: [],
	        	selected: false,
	        	code: 11
	        }, {
	        	name: 'Security',
	        	icon: 'poll',
	        	submenu: [{
	        		name: 'Authorization CPA',
	        		code: 9
	        	}],
	        	selected: false,
	        	code: 8
	        }, {
	        	name: 'Categories',
	        	icon: 'home',
	        	submenu: [],
	        	selected: false,
	        	code: 12
	        }, {
	        	name: 'Exit',
	        	icon: 'cancel',
	        	submenu: [],
	        	selected: false,
	        	code: 10
	        }];

	  	this.menuENG = [{
	        	name: 'Home',
	        	icon: 'home',
	        	submenu: [],
	        	selected: false,
	        	code: 0
	        }, {
	        	name: 'Account',
	        	icon: 'person',
	        	submenu: [{
	        		name: 'My Data',
	        		code: 2
	        	},{
	        		name: 'Balance',
	        		code: 3
	        	}, {
	        		name: 'Billing',
	        		code: 4
	        	}],
	        	selected: false,
	        	code: 1
	        }, {
	        	name: 'My Sites',
	        	icon: 'public',
	        	selected: false,
	        	code: 5
	        }, {
	        	name: 'Ads',
	        	icon: 'collections',
	        	selected: false,
	        	code: 6
	        }, {
	        	name: 'Api',
	        	icon: 'exit_to_app',
	        	submenu: [],
	        	selected: false,
	        	code: 7
	        }, {
	        	name: 'Exit',
	        	icon: 'cancel',
	        	submenu: [],
	        	selected: false,
	        	code: 8
	        }];

	  	return this;
	});



	ser.factory('idioma', function(){
		this.spanish = {
			home: {
				revenueTitle: 'REPORTE DE INGRESOS',
				performance: 'REPORTE DE RENDIMIENTO',
				custom: 'REPORTE PERSONALIZADO',
				referers: 'REFERIDOS',
				impresiones: 'IMPRESIONES',
				lmonth: 'ULTIMO MES',
				cmonth: 'MES ACTUAL',
				lweek: 'SEMANA PASADA',
				today: 'HOY',
				fecha: 'FECHA',
				totalEarning: 'GANANCIAS TOTALES',
				l7days: 'ULTIMOS 7 DIAS',
				formatNot: 'FORMATO NO DETECTADO EN SUS PAGINAS',
				instalFormat: 'INSTALAR FORMATO',
				adFormat: 'ELIJA LOS FORMATOS DE AVISO',
				showStats: 'MOSTRAR ESTADISTICAS SOLO PARA:',
				custom: 'PERSONALIZADO',
				country: 'pais',
				device: 'dispositivo',
				section: 'seccion',
				size: 'medida',
				revenueDevice: 'ganancias por dispositivo',
				revenueCountry: 'ganancias por pais',
				seleDate: 'seleccione la fecha',
				today: 'hoy',
				yesterday: 'ayer',
				byesterday: 'anteayer',
				revenue: 'GANANCIAS',
				traffic: '% DE TRAFICO',
				filter: 'filtrar por',
				defecto: '(por defecto: todos)'
			}
		}
		this.english = {
			home: {
				revenueTitle: 'REVENUE REPORT',
				performance: 'PERFORMANCE REPORT',
				custom: 'CUSTOM REPORT',
				referers: 'REFERERS',
				impresiones: 'IMPRESSIONS',
				lmonth: 'LAST MONTH',
				cmonth: 'CURRENT MONTH',
				lweek: 'LAST WEEK',
				today: 'TODAY',
				fecha: 'DATE',
				totalEarning: 'TOTAL EARNING',
				l7days: 'LAST 7 DAYS',
				formatNot: 'FORMAT NOT DETECTED ON YOUR PAGES',
				instalFormat: 'INSTALL FORMAT',
				adFormat: 'CHOOSE THE AD FORMATS',
				showStats: 'SHOWING STATS ONLY FOR:',
				custom: 'CUSTOM',
				country: 'country',
				device: 'device',
				section: 'seccion',
				size: 'size',
				revenueDevice: 'revenue by device',
				revenueCountry: 'revenue by country',
				seleDate: 'select the date',
				today: 'today',
				yesterday: 'yesterday',
				byesterday: 'before yesterday',
				revenue: 'REVENUE',
				traffic: '% OF TRAFFIC',
				filter: 'filter by',
				defecto: '(default: all)'
			}
		}
		return this;
	})


	ser.factory('webservice', ['$http', '$location', function($http, $location){

		var that = this;

		var path = "http://ecpm.adbooth.com:8000";
		var reportPath = 'http://ns513258.ip-198-27-85.net:3625'
		var response;

		this.get = function (cont, callback, callbackFalla) {
			var req = {
				method: 'GET',
			 	url: path+cont,
			 	headers: {
			   		'Authorization': 'Bearer '+that.token
			 	}
			}
			$http(req)
			.success(function (data) {
				callback(data);
			})
			.error(function (data) {
				callbackFalla(data);
			});
		}

		this.remove = function (cont, callback, callbackFalla) {
			var req = {
				method: 'DELETE',
			 	url: path+cont,
			 	headers: {
			   		'Authorization': 'Bearer '+that.token
			 	}
			}
			$http(req)
			.success(function (data) {
				callback(data);
			})
			.error(function (data) {
				callbackFalla(data);
			});
		}

		this.post = function (cont, data, callback, callbackFalla) {
			var req = {
				method: 'POST',
			 	url: path+cont,
			 	headers: {
			   		'Authorization': 'Bearer '+that.token
			 	},
			 	data: data
			}
			$http(req)
			.success(function (data) {
				callback(data);
			})
			.error(function (data) {
				callbackFalla(data);
			});
		}

		this.postWithOutBearer = function (cont, data, callback, callbackFalla) {
			var req = {
				method: 'POST',
			 	url: path+cont,
			 	data: data,
			 	headers: {
			   		'Authorization': 'Basic c3RhOnBhc3N3b3Jk'
			 	}
			}
			$http(req)
			.success(function (data) {
				console.log("success withoutbearer")
				callback(data);
			})
			.error(function (data, status) {
				console.log("error",data)
				console.log("error",status)
				if (!relogin && status==401) {

					function callbackIsLogged(data) {
						isLogged = data;
					}

					localservice.get("isLogged", callbackIsLogged);

					relogin = true;
					if(isLogged) {
						$mdDialog.show({
							controller: reloginController,
							templateUrl: 'templates/relogin.html?v='+ cacheVersion,
							clickOutsideToClose: false
						})
						.then(function(answer) {
							relogin = false;
						}, function() {
							relogin = false;
						});	
					}
				}else{
					if (callbackFalla)
						callbackFalla();
				}
			});
		}


		this.put = function (cont, data, callback, callbackFalla) {
			var req = {
				method: 'PUT',
			 	url: path+cont,
			 	headers: {
			   		'Authorization': 'Bearer '+that.token
			 	},
			 	data: data
			}
			$http(req)
			.success(function (data) {
				callback(data);
			})
			.error(function (data, status) {
				callbackFalla();
			});
		}

		this.login = function (user, pass, callback, callbackFalla) {
			var req = {
				method: 'POST',
			 	url: path+'/token',
			 	headers: {
			   		'Authorization': 'Basic bmV0d29ya3M6QWx0YVNlZ3VyaWRhZDEyMw=='
			 	},
			 	data: { grant_type: 'password', username: user, password: pass }
			}
			$http(req)
			.success( function (data) {
				if (data.access_token) {
					localStorage.networkToken = data.access_token;
					that.token = data.access_token;
					callback();
				}else{
					callbackFalla(data);
				}
			})
			.error( function (data) {
				callbackFalla(data);
			});
		}

		this.logout = function (callback, callbackFalla) {
			var req = {
				method: 'DELETE',
			 	url: path+'/logout',
			 	headers: {
			   		'Authorization': 'Bearer '+that.token
			 	}
			}
			$http(req)
			.success(function (data) {
				callback(data);
			})
			.error(function (data) {
				callbackFalla(data);
			});
		}

		this.download = function (token, id, path, callback, fallback) {
			var req = {
				method: 'GET',
			 	url: reportPath+'/download' + '?path=' + path + '&reportId='+id+'&token=' + encodeURIComponent(token)
			}
			$http(req)
			.success(function (data) {
				callback(data);
			})
			.error(function (data) {
				fallback(data);
			})
		}

		this.postHour = function (cont, data, callback, callbackFalla) {
			var req = {
				method: 'POST',
			 	url: path+cont,
			 	headers: {
			   		'Authorization': 'Bearer '+that.token
			 	},
			 	data: data,
			 	timeout: 3600000
			}
			$http(req)
			.success(function (data) {
				callback(data);
			})
			.error(function (data) {
				callbackFalla(data);
			});
		}

		this.getHour = function (cont, callback, callbackFalla) {
			var req = {
				method: 'GET',
			 	url: path+cont,
			 	headers: {
			   		'Authorization': 'Bearer '+that.token
			 	},
			 	timeout: 3600000
			}
			$http(req)
			.success(function (data) {
				callback(data);
			})
			.error(function (data) {
				callbackFalla(data);
			});
		}

		this.token = "";

		this.setToken = function (t) {
			that.token = t;
		}

		return this;
	}]);

	ser.factory('localservice', ['$location', '$rootScope', '$mdToast', function ($location, $rootScope, $mdToast) {

		var localData = {};

		var userData;

		var set = function (name, data) {
			localData[name] = data;
		}

	    var broadcastUser = function (state) {
	      	$rootScope.$broadcast('userData', state);
	    };

	    var broadcast = function (name, state) {
	      	$rootScope.$broadcast(name, state);
	    };

	    var setUser = function (newData) {
	      	userData = newData;
	      	localData['user'] = newData;
	      	broadcastUser(userData);
	    };

		var get = function (name, callback, callbackFalla) {
			if(localData[name])
				callback(localData[name]);
			else
				callbackFalla();
		}

		var toast = function(text) {
		    $mdToast.show(
		      	$mdToast.simple()
		        	.content(text)
		        	.position('top right')
		        	.hideDelay(3000)
		    );
	  	};

		var hours = [
			{
				display: '00',
				time: 0
			},
			{
				display: '01',
				time: 1
			},
			{
				display: '02',
				time: 2
			},
			{
				display: '03',
				time: 3
			},
			{
				display: '04',
				time: 4
			},
			{
				display: '05',
				time: 5
			},
			{
				display: '06',
				time: 6
			},
			{
				display: '07',
				time: 7
			},
			{
				display: '08',
				time: 8
			},
			{
				display: '09',
				time: 9
			},
			{
				display: '10',
				time: 10
			},
			{
				display: '11',
				time: 11
			},
			{
				display: '12',
				time: 12
			},
			{
				display: '13',
				time: 13
			},
			{
				display: '14',
				time: 14
			},
			{
				display: '15',
				time: 15
			},
			{
				display: '16',
				time: 16
			},
			{
				display: '17',
				time: 17
			},
			{
				display: '18',
				time: 18
			},
			{
				display: '19',
				time: 19
			},
			{
				display: '20',
				time: 20
			},
			{
				display: '21',
				time: 21
			},
			{
				display: '22',
				time: 22
			},
			{
				display: '23',
				time: 23
			}
		];

		return {
			setUser: setUser,
			set: set,
			get: get,
			broadcast: broadcast,
			hours: hours,
			toast: toast
		};

	}]);


	ser.factory('createAdFactory', function () {

		this.metodo = 0;

		this.set = function (m) {
			this.metodo = m;
		}

		this.get = function () {
			return metodo;
		}

		return this;
	});

	ser.factory('db', ['$window', '$q', function ($window, $q) {
		//var indexedDB = $window.indexedDB;
	    var db = null;
	    var lastIndex = 0;

	    var open = function () {
			var deferred = $q.defer();
			var version = 6;
			var request = indexedDB.open("tabsData", version);

			request.onupgradeneeded = function (e) {
			   	db = e.target.result;

			   	e.target.transaction.onerror = indexedDB.onerror;

			   	if (!db.objectStoreNames.contains("tab2")) {
			    	db.createObjectStore("tab2", {
			    		keyPath: "timestamp"
			    	});
			   	}

			   	if (!db.objectStoreNames.contains("newTable")) {
			    	db.createObjectStore("newTable", {
			    		keyPath: "reportId"
			    	});
			   	}

			   	if (!db.objectStoreNames.contains("card")) {
			    	db.createObjectStore("card", {
			    		keyPath: "timestamp"
			    	});
			   	}

			};

			request.onsuccess = function (e) {
			   db = e.target.result;
			   deferred.resolve();
			};

			request.onerror = function () {
			   deferred.reject();
			};

			return deferred.promise;
		}

		var addTab = function (tab) {
			var deferred = $q.defer();
			var transaction = db.transaction(["tab2"],"readwrite");
			var store = transaction.objectStore("tab2");
			var request = store.add(tab);

			request.onerror = function(e) {
		        deferred.reject();
		    }

		    request.onsuccess = function(e) {
		        deferred.resolve();
		    }

		    return deferred.promise;
		}

		var getTabs = function () {
			var deferred = $q.defer();
			var data = [];
			var request = db.transaction(["tab2"], "readonly").objectStore("tab2").openCursor();
			request.onsuccess = function(e) {
		        var cursor = e.target.result;
		        if(cursor) {
		            data.push(cursor.value);
		            cursor.continue();
		        }
		        deferred.resolve(data);
		    }
		    request.onerror = function (e) {
                deferred.reject("Something went wrong!!!");
            }

            return deferred.promise;
		}

		var saveTable = function (table, size) {
			var deferred = $q.defer();
			var worker = new Worker('js/workers/save_table.js');
		    worker.addEventListener('message', function(e) {
		    	switch (e.data.type) {
		    		case 'ready':
		    			worker.postMessage({table: table, size: size});
		    			break;
		    		case 'finish':
		    			worker.terminate();
		    			console.log('termino');
		    			deferred.resolve();
		    		default:
		    			break;
		    	}
	      	}, false);

		    return deferred.promise;
		}

		var getTables = function () {
			var deferred = $q.defer();
			var data = [];
			var request = db.transaction(["newTable"], "readonly").objectStore("newTable").openCursor();
			request.onsuccess = function(e) {
		        var cursor = e.target.result;
		        if(cursor) {
		            data.push(cursor.value);
		            cursor.continue();
		        }
		        deferred.resolve(data);
		    }
		    request.onerror = function (e) {
                console.log(e.value);
                deferred.reject("Something went wrong!!!");
            }

            return deferred.promise;
		}

		var getTable = function (id) {
			var deferred = $q.defer();
		    var worker = new Worker('js/workers/get_table.js');
		    worker.addEventListener('message', function(e) {
		    	switch (e.data.type) {
		    		case 'ready':
		    			worker.postMessage(id);
		    			break;
		    		case 'table':
		    			worker.terminate();
		    			deferred.resolve(e.data.data);
		    	}
	      	}, false);

	      	return deferred.promise;
		}

		var deleteTable = function (id) {
    		var worker = new Worker('js/workers/delete_table.js');
    	    worker.addEventListener('message', function(e) {
    	    	switch (e.data.type) {
    	    		case 'ready':
    	    			worker.postMessage(id);
    	    			break;
    	    		case 'finish':
    	    			worker.terminate();
    	    	}
          	}, false);
		}

		var deleteTab = function (id) {
			var t = db.transaction(["tab2"], "readwrite");
			var request = t.objectStore("tab2").delete(id);
			request.onerror = function (e) {
                console.log(e.value);
            }
		}

		var putTab = function (tab) {
			var transaction = db.transaction(["tab2"],"readwrite");
			var store = transaction.objectStore("tab2");
			var request = store.put(tab);
		}

		var putTable = function (tab) {
			var transaction = db.transaction(["newTable"],"readwrite");
			var store = transaction.objectStore("newTable");
			var request = store.put(tab);
		}

		var addCard = function (card) {
			var deferred = $q.defer();
			var transaction = db.transaction(["card"],"readwrite");
			var store = transaction.objectStore("card");
			var request = store.add(card);

			request.onerror = function(e) {
		        deferred.reject();
		    }

		    request.onsuccess = function(e) {
		        deferred.resolve();
		    }

		    return deferred.promise;
		}

		var getCards = function () {
			var deferred = $q.defer();
			var data = [];
			var request = db.transaction(["card"], "readonly").objectStore("card").openCursor();
			request.onsuccess = function(e) {
		        var cursor = e.target.result;
		        if(cursor) {
		            data.push(cursor.value);
		            cursor.continue();
		        }
		        deferred.resolve(data);
		    }
		    request.onerror = function (e) {
                console.log(e.value);
                deferred.reject("Something went wrong!!!");
            }

            return deferred.promise;
		}

		var deleteCard = function (id) {
			var t = db.transaction(["card"], "readwrite");
			var request = t.objectStore("card").delete(id);
		}

		var putCard = function (card) {
			var transaction = db.transaction(["card"],"readwrite");
			var store = transaction.objectStore("card");
			var request = store.put(card);
		}

		return {
			open: open,
			addTab: addTab,
			getTabs: getTabs,
			saveTable: saveTable,
			getTables: getTables,
			deleteTable: deleteTable,
			deleteTab: deleteTab,
			putTab: putTab,
			putTable: putTable,
			getCards: getCards,
			deleteCard: deleteCard,
			putCard: putCard,
			addCard: addCard,
			getTable: getTable
		}
	}]);

	ser.factory('socketio', ['webservice', 'localservice', 'reportService', 'db', '$timeout', 'cardService', '$rootScope', function (webservice, localservice, reportService, db, $timeout, cardService, $rootScope) {

		var token = webservice.token;

		var formatDate = function(date){
		    date = new Date(date);
		    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())/1000;
		}

		this.newReport = function (data, key, noColumns) {
			token = webservice.token;
			var socket = io('http://ecpm.adbooth.com:8001', {'forceNew': true});
			var id = '';

			var msg = {
			    "messageType": "AUTHENTICATE",
			    "data": token,
			    "petition":{
			    	"messageType":"GET_REPORT_PATH",
			        "data":{
			        	"filters": data.filters,
		            	"from": formatDate(data.from),
		            	"groups": data.groups,
		            	"range": data.range,
		            	"format" : "json",
		            	"to": formatDate(data.to)
		            }
			    }
		  	}
			socket.on('connect', function () {
				socket.emit('message', msg);
				socket.on('message', function(data) {
					switch (data.messageType) {
						case 'AUTHENTICATION_RESPONSE':
							localservice.broadcast('update', {number: key, state: 'Authenticating', msg: msg});
							break;
						case 'GENERATING_REPORT_RESPONSE':
							id = data.petitionId;
							localservice.broadcast('update', {number: key, state: 'Requesting report', id: data.petitionId});
							break;
						case 'QUEUE_POSITION_UPDATE':
							if (data.position)
								localservice.broadcast('update', {number: key, state: 'In Queue. Position '+data.position});
							else
								localservice.broadcast('update', {number: key, state: 'Generating report'});
							break;
						case 'PATH_RESPONSE':
							var size = data.sizeInBytes/1024/1024;
							localservice.broadcast('update', {number: key, state: 'Downloading report ('+(size.toFixed(2))+'mb)', dwn: true});
							webservice.download(token, id, data.path, function (data) {
								socket.disconnect();
								localservice.broadcast('update', {number: key, state: 'Data processing', noApply: true, dwn: false});
								reportService.generate(data, noColumns, function (table, footer) {
									var nReport = {reportId: id, footer: footer, table: table}
									localservice.broadcast('update', {number: key, state: 'Saving on database', noApply: true});
									db.saveTable(nReport, size).then(function () {
										localservice.broadcast('update', {number: key, state: 'Ready', noApply: true});
									}, function (e) {
										console.log(e);
									});
								});
							}, function (data) {
								localservice.broadcast('update', {number: key, state: 'Error downloading'});
							});
							break;
						case 'ERROR':
							if (data.error === 'Invalid token')
								localservice.broadcast('update', {number: key, state: 'Session expired'});
						default:
							break;
					}
				});

			});
		}

		var socket;

		this.socketInit = function () {
		  	token = webservice.token;
		  	socket = io('http://ecpm.adbooth.com:3400');
		  	var msg = {
		  	    "token": token
	  	  	}
	  	  	var msg2 = {
  	       		"id": 7,
  	          	"name": "pototo"
  	  	 	};
	  	  	var count = 0;
		  	socket.on('connect', function () {
		  		localservice.broadcast('socketConnect', null);
	  	 		socket.emit('AUTHENTICATION', msg);
		  	});
		  	socket.on('AUTHENTICATION_RESPONSE', function(data) {
		  	 	console.log(data)
		  	 	//socket.emit('INIT_CLEAN', {});    
		  	});
		  	socket.on('REPORT_UPDATE', function(data) {
		  		console.log('REPORT_UPDATE');
		  		console.log(data);
		  	 	cardService.updateCard(data);
		  	 	if (data.path) {
		  	 		var size = data.sizeInBytes/1024/1024;
		  	 		localservice.broadcast('update', {number: data.idReport, state: 'Downloading report ('+(size.toFixed(2))+'mb)', dwn: true});
		  	 		webservice.download(token, id, data.path, function (data) {
		  	 			socket.disconnect();
		  	 			localservice.broadcast('update', {number: data.idReport, state: 'Data processing', noApply: true, dwn: false});
		  	 			reportService.generate(data, noColumns, function (table, footer) {
		  	 				var nReport = {reportId: id, footer: footer, table: table}
		  	 				localservice.broadcast('update', {number: data.idReport, state: 'Saving on database', noApply: true});
		  	 				db.saveTable(nReport, size).then(function () {
		  	 					localservice.broadcast('update', {number: data.idReport, state: 'Ready', noApply: true});
		  	 				}, function (e) {
		  	 					console.log(e);
		  	 				});
		  	 			});
		  	 		}, function (data) {
		  	 			localservice.broadcast('update', {number: data.idReport, state: 'Error downloading'});
		  	 		});
		  	 	}
		  	 // socket.emit('GET_REPORT', msg2);
		  	});
		  	socket.on('ERROR', function(data) {
		  	 	console.log(data)
		  	 // socket.emit('GET_REPORT', msg2);
		  	});
		  	//var lala = true;
		  	socket.on('REPORT_INIT', function(data) {
		  		console.log('REPORT_INIT');
	  			console.log(data)
	  			cardService.newCards(data);
		  	});

		  	socket.on('disconnect', function(data) {
		  		localservice.broadcast('socketDisconnect', null);
		  		console.log(data)
		  	 // socket.emit('GET_REPORT', msg2);
		  	});
		}

		this.generateReport = function (data, key, noColumns) {
	        var msg = {
	        	'where': data.filters,
            	'from': formatDate(data.from),
            	'groups': data.groups,
            	'range': data.range,
            	'filters': data.nFilters,
            	'format' : 'json',
            	'to': formatDate(data.to)
            }
            socket.emit('GET_REPORT', msg);
		}

		$rootScope.$on("reportUpdate",function (event, data) {
			socket.emit('INIT_UPDATE', data);
		});

		$rootScope.$on("updateName",function (event, data) {
			console.log('update name');
			socket.emit('CHANGE_NAME_REPORT', data);
			//socket.emit('INIT_CLEAN', {});
		});

		$rootScope.$on("deleteReport",function (event, data) {
			console.log('Borra tabla');
			socket.emit('INIT_DELETE', {idReport: data});
		});

		return this;

	}]);

	ser.factory('cardService', ['localservice', function (localservice) {

		var cards = [];
		var self = this;
		var cache = {};

		this.newCards = function (c) {
			var found = false;
			if (Array.isArray(c)) {
				cards = c;
			}else{
				for (var i = 0; i < cards.length; i++) {
					if (cards[i].idReport == c.idReport) {
						cards[i] = c;
						break;
					}
				}
			}
			broadCards();
		}

		var broadCards = function () {
			var nc = [];
			var c = {};
			var cache;
			for (var i = 0; i < cards.length; i++) {
				c = {};
				if (cards[i].idReport) c.number = cards[i].idReport;
				if (cards[i].ts) c.timestamp = cards[i].ts;
				if (cards[i].name) c.reportName = cards[i].name;
				if (cards[i].status) {
					var p = '';
					if (cards[i].queue) p = ' Position: '+cards[i].queue;
					switch (cards[i].status) {
						case 0:
							c.state = 'In queue.'+p;
							break;
						case 1:
							c.state = 'Generating report';
							break;
						case 2:
							c.state = 'Ready';
							break;
						case 3:
						case 4:
						case 5:
							break;
						case 6: 
							c.state = 'Error';
							break;
						default:
							c.state = 'Pending';
							break;
					}
				}else{
					c.state = 'Ready';
				}
				c.menuOpen = false;
				c.creator = cards[i].ownerReport;
				if (cards[i].cache && ((typeof cards[i].cache) == 'string')) {
					cache = JSON.parse(cards[i].cache);
					if (cache.autoOpen) c.autoOpen = cache.autoOpen;
					if (cache.filterDesc) c.filterDesc = cache.filterDesc;
					if (cache.interval) c.interval = cache.interval;
					if (cache.filters) c.filters = cache.filters;
				}
				nc.push(c);
			}
			localservice.broadcast('newCards', nc);
		}

		this.newCard = function (c) {
			cache = {};
			cache.filters = c.filters;
			cache.interval = c.interval;
			cache.filterDesc = c.filterDesc;
		}

		this.updateCard = function (c) {
			var found = false;
			var	index = 0;
			for (var i = 0; i < cards.length; i++) {
				if (cards[i].idReport == c.idReport) {
					found = true;
					index = i;
					break;
				}
			}
			if (!found) {
				c.cache = cache;
				cards.push(c);
				c.cache = JSON.stringify(c.cache);
				localservice.broadcast('reportUpdate', c);
			}else{
				if (c.status == 2)
					localservice.broadcast('updateName', {idReport: c.idReport, name: 'Report '+c.idReport});
				//cards[index] = c;
				for (p in c) {
					cards[index][p] = c[p];
				}
			}
			broadCards();
		}

		this.deleteCard = function (id) {
			for (var i = 0; i < cards.length; i++) {
				if (cards[i].idReport == id) {
					cards.splice(i, 1);
					break;
				}
			}
			localservice.broadcast('deleteReport', id);
		}

		return this;
	}]);

	ser.factory('reportService',  function () {

		var alias = {
			clicks: 'Clicks',
			clicksu: 'UClicks',
			convs: 'Convs',
			convs_2: 'Convs2',
			convs_3: 'Convs3',
			cost: 'Cost',
			defaults: 'Defaults',
			imps: 'Imps',
			revenue_2: 'Revenue2',
			revenue_3: 'Revenue3',
			wrong_referers: 'Wrong Refs'
		};

		this.generate = function (data, noColumns, callback) {
			var footer = {};
			var columns = [];
			var anchos = {};
			var number = 0;
			var auxNumber = 0;
			footer.clicks = 0;
			footer.clicksu = 0;
			footer.convs = 0;
			footer.convs_2 = 0;
			footer.convs_3 = 0;
			footer.defaults = 0;
			footer.imps = 0;
			footer.impsn = 0;
			footer.impsu = 0;
			footer.profit = 0;
			footer.revenue = 0;
			footer.revenue_2 = 0;
			footer.revenue_3 = 0;
			footer.wrong_referers = 0;
			footer.cost = 0;
			for (var i = 0; i < data.length; i++) {
				footer.clicks += data[i]. clicks;
				footer.clicksu += data[i].clicksu;
				footer.convs += data[i].convs;
				footer.convs_2 += data[i].convs_2;
				footer.convs_3 += data[i].convs_3;
				footer.defaults += data[i].defaults;
				footer.imps += data[i].imps;
				footer.impsn += data[i].impsn;
				footer.impsu += data[i].impsu;
				footer.profit += data[i].profit;
				footer.revenue += data[i].revenue;
				footer.revenue_2 += data[i].revenue_2;
				footer.revenue_3 += data[i].revenue_3;
				footer.wrong_referers += data[i].wrong_referers;
				data[i].cost = data[i].revenue - data[i].profit;
				footer.cost += data[i].cost;
				if (data[i].clicks && data[i].revenue && data[i].impsn) {
					data[i].revenueEcpc = parseFloat((data[i].revenue/data[i].clicks).toFixed(2));
					data[i].revenueEcpmN = parseFloat((data[i].revenue*1000/data[i].impsn).toFixed(2));
				}else{
					data[i].revenueEcpc = 0;
					data[i].revenueEcpmN = 0;
				}
				if (data[i].clicks) {
					data[i].conversionRateClicks = data[i].convs/data[i].clicks;
					data[i].revenueEcpc = data[i].revenue/data[i].clicks;
				}else{
					data[i].conversionRateClicks = 0;
					data[i].revenueEcpc = 0;
				}
				if (data[i].imps) {
					data[i].conversionRateImps = data[i].convs/data[i].imps;
					data[i].costEcpm = data[i].cost*1000/data[i].imps;
					data[i].ctr = data[i].clicks/data[i].imps;
					data[i].profitEcpm = data[i].profit*1000/data[i].imps;
					data[i].revenueEcpm = data[i].revenue*1000/data[i].imps;
					data[i].revenue2Ecpm = data[i].revenue_2*1000/data[i].imps;
					data[i].revenue3Ecpm = data[i].revenue_3*1000/data[i].imps;
				}else{
					data[i].conversionRateImps = 0;
					data[i].costEcpm = 0;
					data[i].ctr = 0;
					data[i].profitEcpm = 0;
					data[i].revenueEcpm = 0;
					data[i].revenue2Ecpm = 0;
					data[i].revenue3Ecpm = 0;
				}
				if (data[i].revenue)
					data[i].revenueShareProfit = data[i].profit*100/data[i].revenue;
				else
					data[i].revenueShareProfit = 0;
				if (data[i].revenueShareProfit)
					data[i].revenueShare = 100 - data[i].revenueShareProfit;
				else
					data[i].revenueShare = 0;
				if (data[i].impsn) {
					footer.revenueEcpmN = footer.revenue*1000/footer.impsn;
				}else{
					footer.revenueEcpmN = 0;
				}
				if (data[i].hour)
					data[i].hour = parseInt(data[i].hour);
			}
			footer.conversionRateClicks = footer.convs/footer.clicks;
			footer.conversionRateImps = footer.convs/footer.imps;
			footer.costEcpm = footer.cost*1000/footer.imps;
			footer.ctr = footer.clicks/footer.imps;
			footer.profitEcpm = footer.profit*1000/footer.imps;
			footer.revenueEcpm = footer.revenue*1000/footer.imps;
			footer.revenue2Ecpm = footer.revenue_2*1000/footer.imps;
			footer.revenue3Ecpm = footer.revenue_3*1000/footer.imps;
			footer.revenueShareProfit = footer.profit*100/footer.revenue;
			footer.revenueShare = 100 - footer.revenueShareProfit;
			footer.revenueEcpc = footer.revenue/footer.clicks;
			footer.revenueEcpmN = footer.revenue*1000/footer.impsn;
			for (var i = 0; i < data.length; i++) {
				for (var p in data[i]) {
					if (i == 0) {
						if (alias[p]) {
							anchos[p] = alias[p].visualLength() + 5; //alias[p].length * 8 + 20;
						}else{
							anchos[p] = p.visualLength() + 5; //p.length * 8 + 20;
						}
					}
					if ((!isNaN(parseFloat(data[i][p])) && isFinite(data[i][p])) && (typeof(data[i][p])!='string')) {
						if ((data[i][p]/data[i][p])!=0) {
							try{
								auxNumber = (data[i][p]).toFixed(4);
							}catch(err){
							}
							number = (auxNumber.toString()).visualLength();
						}else{
							number = ((data[i][p]).toString()).visualLength();
						}
					} else
						number = ((data[i][p]).toString()).visualLength();
					if (!anchos[p]) {
						anchos[p] = number;
						if (anchos[p]<50) {
							anchos[p] = 50;
						}
					} else {
						if (number>anchos[p]) {
							anchos[p] = number;
						}
					}
				}
			};
			console.log(noColumns);
			for (p in data[0]) {
				switch (p) {
					case 'clicks':
						if (noColumns['clicks'])
							columns.push({ name: 'Clicks', field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;">{{row.entity.clicks | number:0}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;">{{grid.appScope.footer.clicks | number:0}}</div>'});
						break;
					case 'clicksu':
						if (noColumns['clicksu'])
							columns.push({ name: 'UClicks', field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;">{{row.entity.clicksu | number:0}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;">{{grid.appScope.footer.clicksu | number:0}}</div>'});
						break;
					case 'convs':
						if (noColumns['conversions'])
							columns.push({ name: 'Convs', field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;">{{row.entity.convs | number:0}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;">{{grid.appScope.footer.convs | number:0}}</div>'});
						break;
					case 'convs_2':
						if (noColumns['conversions2'])
							columns.push({ name: 'Convs2', field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;">{{row.entity.convs_2 | number:0}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;">{{grid.appScope.footer.convs_2 | number:0}}</div>'});
						break;
					case 'convs_3':
						if (noColumns['conversions3'])
							columns.push({ name: 'Convs3', field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;">{{row.entity.convs_3 | number:0}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;">{{grid.appScope.footer.convs_3 | number:0}}</div>'});
						break;
					case 'cost':
						if (noColumns['cost'])
							columns.push({ name: 'Cost', field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;">{{row.entity.cost | number:2}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;">{{grid.appScope.footer.cost | number:2}}</div>'});
						break;
					case 'defaults':
						if (noColumns['defaults'])
							columns.push({ name: 'Defaults', field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;">{{row.entity.defaults | number:0}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;">{{grid.appScope.footer.defaults | number:0}}</div>'});
						break;
					case 'imps':
						if (noColumns['impressions'])
							columns.push({ name: 'Imps', field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;">{{row.entity.imps | number:0}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;">{{grid.appScope.footer.imps | number:0}}</div>'});
						break;
					case 'impsn':
						if (noColumns['impsn'])
							columns.push({ name: p, field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;">{{row.entity.impsn | number:0}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;">{{grid.appScope.footer.impsn | number:0}}</div>'});
						break;
					case 'impsu':
						if (noColumns['impsu'])
							columns.push({ name: p, field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;">{{row.entity.impsu | number:0}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;">{{grid.appScope.footer.impsu | number:0}}</div>'});
						break;
					case 'profit':
						if (noColumns['profit'])
							columns.push({ name: p, field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;">{{row.entity.profit | number:2}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;">{{grid.appScope.footer.profit | number:2}}</div>'});
						break;
					case 'revenue':
						if (noColumns['revenue'])
							columns.push({ name: p, field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;">{{row.entity.revenue | number:2}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;">{{grid.appScope.footer.revenue | number:2}}</div>'});
						break;
					case 'revenue_2':
						if (noColumns['revenue2'])
							columns.push({ name: 'Revenue2', field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;">{{row.entity.revenue_2 | number:2}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;">{{grid.appScope.footer.revenue_2 | number:2}}</div>'});
						break;
					case 'revenue_3':
						if (noColumns['revenue3'])
							columns.push({ name: 'Revenue3', field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;">{{row.entity.revenue_3 | number:2}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;">{{grid.appScope.footer.revenue_3 | number:2}}</div>'});
						break;
					case 'wrong_referers':
						if (noColumns['wrongReferers'])
							columns.push({ name: 'Wrong Refs', field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;">{{row.entity.wrong_referers | number:0}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;">{{grid.appScope.footer.wrong_referers | number:0}}</div>'});
						break;
					case 'conversionRateClicks':
						if (noColumns['conversionRateClicks'])
							columns.push({ name: p, field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;">{{row.entity.conversionRateClicks | number:4}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;">{{grid.appScope.footer.conversionRateClicks | number:4}}</div>'});
						break;
					case 'conversionRateImps':
						if (noColumns['conversionRateImps'])
							columns.push({ name: p, field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;">{{row.entity.conversionRateImps | number:4}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;">{{grid.appScope.footer.conversionRateImps | number:4}}</div>'});
						break;
					case 'costEcpm':
						if (noColumns['costEcpm'])
							columns.push({ name: p, field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;">{{row.entity.costEcpm | number:4}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;">{{grid.appScope.footer.costEcpm | number:4}}</div>'});
						break;
					case 'ctr':
						if (noColumns['ctr'])
							columns.push({ name: p, field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;">{{row.entity.ctr | number:4}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;">{{grid.appScope.footer.ctr | number:4}}</div>'});
						break;
					case 'profitEcpm':
						if (noColumns['profitEcpm'])
							columns.push({ name: p, field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;">{{row.entity.profitEcpm | number:4}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;">{{grid.appScope.footer.profitEcpm | number:4}}</div>'});
						break;
					case 'revenueEcpm':
						if (noColumns['revenueEcpm'])
							columns.push({ name: p, field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;">{{row.entity.revenueEcpm | number:4}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;">{{grid.appScope.footer.revenueEcpm | number:4}}</div>'});
						break;
					case 'revenueShare':
						if (noColumns['revenueShare'])
							columns.push({ name: p, field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;">{{row.entity.revenueShare | number:2}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;">{{grid.appScope.footer.revenueShare | number:4}}</div>'});
						break;
					case 'revenueShareProfit':
						if (noColumns['revenueShareProfit'])
							columns.push({ name: p, field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;">{{row.entity.revenueShareProfit | number:2}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;">{{grid.appScope.footer.revenueShareProfit | number:4}}</div>'});
						break;
					case 'revenue2Ecpm':
						if (noColumns['revenue2Ecpm'])
							columns.push({ name: p, field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;">{{row.entity.revenue2Ecpm | number:4}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;">{{grid.appScope.footer.revenue2Ecpm | number:4}}</div>'});
						break;
					case 'revenue3Ecpm':
						if (noColumns['revenue3Ecpm'])
							columns.push({ name: p, field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;">{{row.entity.revenue3Ecpm | number:4}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;">{{grid.appScope.footer.revenue3Ecpm | number:4}}</div>'});
						break;
					case 'revenueEcpc':
						if (noColumns['revenueEcpc'])
							columns.push({ name: p, field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;">{{row.entity.revenueEcpc | number:4}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;">{{grid.appScope.footer.revenueEcpc | number:4}}</div>'});
						break;
					case 'revenueEcpmN':
						if (noColumns['revenueEcpmN'])
							columns.push({ name: p, field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;">{{row.entity.revenueEcpmN | number:4}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;">{{grid.appScope.footer.revenueEcpmN | number:4}}</div>'});
						break;
					case 'hour':
							columns.push({ name: p, width: anchos[p], field: p, type:'number'});
						break;
					default:
						columns.push({ name: p, field: p, width: anchos[p]});
						break;
				}
			}
			var reportTable = {
				paginationPageSizes: [10, 50, 200, 500],
				paginationPageSize: 50,
				enableFiltering: true,
				enableGridMenu: true,
				enableColumnResizing: true,
				enableSorting: true,
				showColumnFooter: true,
				saveOrder: true,
				columnDefs: columns,
				data : data
			}
			callback(reportTable, footer);
		}

		if (localStorage.columns && localStorage.columns[0].viewName)
			this.filters = JSON.parse(localStorage.columns);
		else {
			this.filters = [
				{
					name: 'clicks',
					viewName: 'Clicks',
					status: true
				},{
					name: 'clicksu',
					viewName: 'Unique Clicks',
					status: true
				},{
					name: 'conversionRateClicks',
					viewName: 'Conversion Rate Clicks',
					status: true
				},{
					name: 'conversionRateImps',
					viewName: 'Conversion Rate Imps',
					status: true
				},{
					name: 'conversions',
					viewName: 'Conversions',
					status: true
				},{
					name: 'conversions2',
					viewName: 'Conversions 2',
					status: true
				},{
					name: 'conversions3',
					viewName: 'Conversions 3',
					status: true
				},{
					name: 'cost',
					viewName: 'Cost',
					status: true
				},{
					name: 'costEcpm',
					viewName: 'Cost eCPM',
					status: true
				},{
					name: 'ctr',
					viewName: 'CTR',
					status: true
				},{
					name: 'defaults',
					viewName: 'Defaults',
					status: true
				},{
					name: 'impressions',
					viewName: 'Impressions',
					status: true
				},{
					name: 'impsn',
					viewName: 'Network Impressions',
					status: true
				},{
					name: 'impsu',
					viewName: 'Unique Impressions',
					status: true
				},{
					name: 'profit',
					viewName: 'Profit',
					status: true
				},{
					name: 'profitEcpm',
					viewName: 'Profit eCPM',
					status: true
				},{
					name: 'revenue',
					viewName: 'Revenue',
					status: true
				},{
					name: 'revenueEcpm',
					status: true
				},{
					name: 'revenue2',
					viewName: 'Revenue 2',
					status: true
				},{
					name: 'revenue2Ecpm',
					viewName: 'Revenue 2 eCPM',
					status: true
				},{
					name: 'revenue3',
					viewName: 'Revenue 3',
					status: true
				},{
					name: 'revenue3Ecpm',
					viewName: 'Revenue 3 eCPM',
					status: true
				},{
					name: 'revenueEcpc',
					viewName: 'Revenue eCPC',
					status: true
				},{
					name: 'revenueShare',
					viewName: 'Revenue Share',
					status: true
				},{
					name: 'revenueShareProfit',
					viewName: 'Revenue Share Profit',
					status: true
				},{
					name: 'wrongReferers',
					viewName: 'Wrong Referrers',
					status: true
				}
			];
		}

		return this;
	});


})();
