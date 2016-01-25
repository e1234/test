( function () {

	var ser = angular.module('pathService', []);

	ser.factory('url', function () {
		
		this.api = globalUrls.api;
		this.downloader = globalUrls.downloader;
		this.socket = globalUrls.socket;

	  	return this;
	});

})();


 
