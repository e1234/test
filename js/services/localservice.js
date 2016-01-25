( function () {

	var ser = angular.module('Localservice', []);

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


})();
