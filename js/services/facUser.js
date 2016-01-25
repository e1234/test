( function () {

	var ser = angular.module('FacUser', []);

	ser.factory('facUser', function(){
		this.userData = [];
		return this;
	});

})();