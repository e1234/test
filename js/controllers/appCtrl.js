( function () {
	window.scrollTo(0, 1);
	var ctrl = angular.module('AppCtrl',[]);

		ctrl.controller('AppCtrl', ['$scope', '$mdSidenav', '$log', '$location', 'idioma', 'facMenu', '$mdDialog', 'webservice', 'localservice', '$route', '$rootScope', 'deviceDetector', function ($scope, $mdSidenav, $log, $location, idioma, facMenu, $mdDialog, webservice, localservice, $route, $rootScope, deviceDetector) {

		$scope.angularLoaded = true;

		$scope.inProduction = productionFinal;

		$scope.$on("titleReady", function(evt, data) {
			$scope.title = data;
		});

		$scope.mobileHide = false;
		$scope.$on("mobileHide", function(evt, data) {
			$scope.mobileHide = !$scope.mobileHide;
		});

		if (deviceDetector.os == 'ios' || deviceDetector.os == 'android' || deviceDetector.os == 'windows-phone' || deviceDetector.os == 'firefoxos'  || deviceDetector.os == 'vita')
			$scope.mobile = true;
		else
			$scope.mobile = false;

		webservice.setToken(localStorage.networkToken);
		webservice.get('/validToken', function (data) {
			if (data.status == 400) {
				$scope.logged = false;
			}else{
				$scope.initialLoad(function () {
					$scope.locales = true;
					$route.reload();
					$scope.logged = true;
					$scope.load = false;
				});
			}
		}, function (data) {
			$scope.logged = false;
			$scope.load = false;
		});

		$scope.user = localservice.userData;

		var ping = function () {
	 		setTimeout(function () {
	 			webservice.get('/validToken', function () {
	 				ping();
	 			});
	 		}, 1200000);
		}

		/*$scope.$on('userData', function (event, newState) {
			$scope.user = newState;
	    });*/

		$scope.logged = false;
		$scope.load = true;

		$scope.enter = function () {
			$scope.logged = !$scope.logged;
		}

		$scope.loading = function () {
			$scope.load = !$scope.load;
		}

		$scope.exit = function () {
			$scope.logged = false;
		}

		$scope.title = 'Home';
		$scope.changeTitle = function (t) {
			$scope.title = t;
		}

		var value;

		$scope.toggleMenu = function() {
			$mdSidenav('left').toggle()
		};
		$scope.log = false;
		$scope.url = $location.url();
		$scope.userModal = function($event) {
			$mdDialog.show({
				controller: 'userController',
				templateUrl: 'templates/user.html?v='+versionPanel,
				targetEvent: $event,
			})
			.then(function(answer) {
				$scope.changeLanguage(answer.lang);
				if (answer.icon) {
					$scope.icon = answer.icon;
					localStorage.icon = answer.icon;
				}
				$route.reload();
			}, function() {
				$scope.alert = 'You cancelled the dialog.';
			});
		};

		$scope.reloginModal = function($event) {
			$mdDialog.show({
				controller: reloginController,
				templateUrl: 'templates/relogin.html?v='+versionPanel,
				targetEvent: $event,
			})
			.then(function(answer) {
			}, function() {
			});
		};

		$scope.changeLanguage = function (i) {
			if (i) {
				localStorage.language = i;
				//format.setLang(i);
				idioma.setIdioma(i);
				if (i == 'spa') {
					$scope.textos = idioma.spanish;
					$scope.menu = facMenu.menu;
				}else
				if (i == 'eng') {
					$scope.textos = idioma.english;
					$scope.menu = facMenu.menuENG;
				}
			}
		}

		$scope.menu = facMenu.menu;

		/*if (localStorage.language) {
			$scope.changeLanguage(localStorage.language);
		}else{
			localStorage.language = 'eng';
			$scope.changeLanguage('eng');
		}

		if (localStorage.icon) {
			$scope.icon = localStorage.icon;
		}else{
			$scope.icon = 'account_circle';
			localStorage.icon = 'account_circle';
		}*/

		$scope.errorAction = function (code) {

		}

		$scope.initialLoad = function (callback) {
            webservice.get('/user', function (data) {
            	ping();
            	localservice.setUser(data);
            	$scope.user = data[0];
            	callback();
            });
            webservice.get('/userAllWithWebsite', function (data) {
            	localservice.set("publishers",data);
				localservice.broadcast("publishersReady",data);
			});
			webservice.get('/websiteAllWithUser', function (data) {
				localservice.set("websites",data);
				localservice.broadcast("websitesReady",data);
			});
		}

	}]);

	

})();

