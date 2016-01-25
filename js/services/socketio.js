( function () {

	var ser = angular.module('Socketio', []);

	ser.service('socketio', ['webservice', 'localservice', 'reportService', 'db', '$timeout', 'cardService', '$rootScope', 'url', function (webservice, localservice, reportService, db, $timeout, cardService, $rootScope, url) {

		var token = webservice.token;

		var formatDate = function(date){
		    date = new Date(date);
		    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())/1000;
		}
		var connected = false;
		var socket;
		var cont = 0;
		this.socketInit = function () {
		  	token = webservice.token;
		  	socket = io(url.socket, { forceNew: true });
		  	var msg = {
		  	    "token": token
	  	  	}
	  	  	var msg2 = {
  	       		"id": 7,
  	          	"name": "pototo"
  	  	 	};
	  	  	var count = 0;
		  	socket.on('connect', function () {
		  		connected = true;
		  		console.log('conecta');
		  		localservice.broadcast('socketConnect', null);
	  	 		socket.emit('AUTHENTICATION', msg);
		  	});
		  	socket.on('AUTHENTICATION_RESPONSE', function(data) {
		  	 	//socket.emit('INIT_CLEAN', {});
		  	});
		  	socket.on('REPORT_UPDATE', function(data) {
		  		console.log('update del socket');
		  		console.log(data);
		  	 	cardService.updateCard(data);
		  	 	var id = data.idReport;
		  	});
		  	socket.on('ERROR', function(data) {
		  		console.log('error');
		  		console.log(data);
		  	 // socket.emit('GET_REPORT', msg2);
		  	});
		  	//var lala = true;
		  	socket.on('REPORT_INIT', function(data) {
		  		console.log('init');
		  		console.log(data);
	  			cardService.newCards(data);
		  	});

  		  	socket.on('REPORT_DELETE', function(data) {
  		  		console.log('delete de afuera');
  		  		console.log(data);
  	  			localservice.broadcast('socketDelete', data.idReport);
  		  	});

		  	socket.on('disconnect', function(data) {
		  		connected = false;
		  		console.log('desconecta');
		  		localservice.broadcast('socketDisconnect', null);
		  		setTimeout(function () {
		  			if (!connected) {
		  				socket = io(url.socket);
		  			}
		  		}, 1500);
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
            	'to': formatDate(data.to),
            	'timezone': data.timezone
            }
            console.log(msg);
            socket.emit('GET_REPORT', msg);
		}

		this.getReport = function (id) {
			console.log('GET_REPORT '+id);
			socket.emit('GET_REPORT', {idReport: id});
		}

		$rootScope.$on("reportUpdate",function (event, data) {
			console.log('update mio INIT_UPDATE');
			console.log(data);
			socket.emit('INIT_UPDATE', data);
		});

		$rootScope.$on("updateName",function (event, data) {
			console.log('change name CHANGE_NAME_REPORT');
			console.log(data);
			socket.emit('CHANGE_NAME_REPORT', data);
			//socket.emit('INIT_CLEAN', {});
		});

		$rootScope.$on("deleteReport",function (event, data) {
			console.log('INIT_DELETE');
			console.log(data);
			socket.emit('INIT_DELETE', {idReport: data});
		});

		return this;

	}]);

})();
