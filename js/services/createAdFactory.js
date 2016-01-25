( function () {

	var ser = angular.module('CreateAdFactory', []);

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

})();