( function () {

	var ser = angular.module('Webservice', []);

	ser.factory('webservice', ['$http', '$location', 'url', function($http, $location, url){

		var that = this;
		var path = url.api;
		var reportPath = url.downloader;
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
		//http://192.168.0.11:5000
		this.put = function (cont, data, callback, callbackFalla) {
			var req = {
				method: 'PUT',
			 	url: path + cont,
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
			 	url: path +'/token',
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

		this.download = function (id, path, callback, fallback) {
			var req = {
				method: 'GET',
			 	url: reportPath+'/download' + '?path=' + path + '&reportId='+id+'&token=' + encodeURIComponent(that.token)
			}
			$http(req)
			.success(function (data) {
				callback(data);
			})
			.error(function (data) {
				fallback(data);
			})
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
							templateUrl: 'templates/relogin.html?v='+versionPanel,
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


})();
