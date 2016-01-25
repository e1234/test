( function () {

	var ctrl = angular.module('MenuCtrl',[]);

	ctrl.controller('menuCtrl', function ($scope, $timeout, $mdSidenav, $log, $mdDialog, facMenu, $location, webservice, localservice) {

		$scope.close = function() {
			$mdSidenav('left').close()
		};

		$scope.clk = function ($event, key, item) {
			for (var i=0; i<$scope.menu.length; i++) {
				if (i!=key) $scope.menu[i].selected = false;
			}
			$scope.menu[key].selected = !$scope.menu[key].selected;
			if (accionesMenu[$scope.menu[key].code]) accionesMenu[$scope.menu[key].code]($event);
		}

		$scope.clkSubmenu = function ($event, key, subkey) {
			if (accionesMenu[$scope.menu[key].submenu[subkey].code]) accionesMenu[$scope.menu[key].submenu[subkey].code]($event);
		}

		var verHome = function () {
			$location.hash('');
			$location.path('home');
			$scope.close();
		}

		var verReport = function () {
			$location.hash('');
			$location.path('report');
			$scope.close();
		}

		var verCreate = function () {
			$location.hash('');
			$location.path('create');
			$scope.close();
		}

		var verABTest = function () {
			$location.hash('');
			$location.path('administrate');
			$scope.close();
		}

		var verCampañas = function () {
			$location.hash('');
			$location.path('campaignlist');
			$scope.close();
		}

		var verReferers = function () {
			$location.hash('');
			$location.path('referers');
			$scope.close();
		}

		var verAdminPublishers = function () {
			$location.hash('');
			$location.path('publishers');
			$scope.close();
		}

		var verCpa = function () {
			$location.hash('');
			$location.path('cpa');
			$scope.close();
		}

		var verAdvertisers = function () {
			$location.hash('');
			$location.path('advertisers');
			$scope.close();
		}

		var verCategories = function () {
			$location.hash('');
			$location.path('categories');
			$scope.close();
		}

		var verOffers = function () {
			$location.hash('');
			$location.path('offers');
			$scope.close();
		}

		var verChannels = function () {
			$location.hash('');
			$location.path('channels');
			$scope.close();
		}

		var verFaq = function () {
			$location.hash('');
			$location.path('faq');
			$scope.close();
		}

		var verMobileReports = function () {
			$location.hash('');
			$location.path('mobile_report');
			$scope.close();
		}

		var logout = function () {
			$scope.close();
			$scope.$parent.loading();
			webservice.logout(function () {
				$scope.$parent.exit();
				//$scope.setLocales(false);
				$location.path('home');
				$scope.$parent.loading();
			})
		}

		//var accionesMenu = [verHome, verReport, null, verCreate, verAdministrate, verCampañas, verReferers, verPublishers, null, verCpa, logout, verAdvertisers, verCategories, verOffers, null, verChannels, verFaq, verMobileReports];
		var accionesMenu = [];
		
		/* v2
		accionesMenu[0] = verHome;
		accionesMenu[1] = verReport;
		accionesMenu[2] = verAdminPublishers;
		accionesMenu[3] = null;
		accionesMenu[4] = verABTest;
		accionesMenu[5] = verAdvertisers;
		accionesMenu[6] = verOffers;
		accionesMenu[7] = verCampañas;
		accionesMenu[8] = null;
		accionesMenu[9] = null;
		accionesMenu[10] = verCategories;
		accionesMenu[11] = verChannels;
		accionesMenu[12] = null;
		accionesMenu[13] = null;
		accionesMenu[14] = null;
		accionesMenu[15] = verReferers;
		accionesMenu[16] = verCpa;
		accionesMenu[17] = null;
		accionesMenu[18] = null;
		accionesMenu[19] = null;
		accionesMenu[20] = null;
		accionesMenu[21] = logout;*/

		//v3
		accionesMenu[0] = verHome;
		accionesMenu[1] = verReport;
		accionesMenu[2] = verMobileReports;
		accionesMenu[3] = null;
		accionesMenu[4] = verAdminPublishers;
		accionesMenu[5] = verReferers;
		accionesMenu[6] = null;
		accionesMenu[7] = verAdvertisers;
		accionesMenu[8] = verOffers;
		accionesMenu[9] = null;
		accionesMenu[10] = null;
		accionesMenu[11] = verABTest;
		accionesMenu[12] = null;
		accionesMenu[13] = verCampañas;
		accionesMenu[14] = verCpa;
		accionesMenu[15] = null;
		accionesMenu[16] = verCategories;
		accionesMenu[17] = verChannels;
		accionesMenu[18] = null;
		accionesMenu[19] = null;
		accionesMenu[20] = null;
		accionesMenu[21] = logout;
	});


	function userController ($scope, $mdDialog, webservice) {
		$scope.opts = {};
		$scope.opts.lang = localStorage.language;
		$scope.guardarCambios = function () {
			$mdDialog.hide($scope.opts);
		}
	}

	function settingsController ($scope, $mdDialog) {

	}

})();