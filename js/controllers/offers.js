(function () {

	var ctrl = angular.module('offers', []);

	ctrl.controller('offersCtrl', ['$scope', '$mdDialog', '$location', 'localservice', function ($scope, $mdDialog, $location, localservice) {

		if($location.path() == "/offers") {
			var path = "Offers";
			localservice.broadcast("titleReady", path);
		}

		$scope.user = {
			title: 'Developer',
			email: 'ipsum@lorem.com',
			firstName: '',
			lastName: '',
			company: 'Google',
			section: '123456',
			city: 'Argentina',
			devicePc:'PC',
			deviceWin:'Windows',
			browserChrome: 'Chrome',
			browserFirefox: 'Firefox',
			searchAdv: 'Adv',
			searchCountry: 'Ar',
			offer: 'Test Name 1',
			falsePayout:'15',
			falseDaily:'12345',
			falseUrl:'https://www.google.com.ar/'

		};

		$scope.selPricing = 1;

		$scope.pricing = [
			{id: 1, name: 'CPA Estatico'},
			{id: 2, name: 'CPA Dinamico'},
			{id: 3, name: 'CPC'},
			{id: 4, name: 'CPM'},
			{id: 5, name: 'CPM Dinamico'}
		];

		$scope.selDevice = 4;

		$scope.devices = [
			{id: 1, name: 'PC'},
			{id: 2, name: 'Mobile'},
			{id: 3, name: 'Tablet'},
			{id: 4, name: 'Mobile 3g'},
			{id: 5, name: 'Tablet 3g'}
		];

		$scope.selOs = 1;
		$scope.Os = [
			{id: 1, name: 'Android'},
			{id: 2, name: 'iOS'},
			{id: 3, name: 'Windows Phone'}
		];

		$scope.selCarrier = 1;
		$scope.carrier = [
			{id: 1, name: 'Movistar'},
			{id: 2, name: 'Claro'},
			{id: 3, name: 'Vodafone'}
		];

		$scope.selBrowser = 1;

		$scope.browser = [
			{id: 1, name: 'Chrome'},
			{id: 2, name: 'Firefox'},
			{id: 3, name: 'Edge'},
			{id: 4, name: 'Opera'},
			{id: 5, name: 'IE'}
		];

		$scope.channels = [
			{ name: 'Movies', wanted: true },
			{ name: 'Downloads', wanted: false },
			{ name: 'Sports', wanted: true },
			{ name: 'Music', wanted: false },
			{ name: 'Erotic', wanted: false },
			{ name: 'Books', wanted: false },
			{ name: 'Series & Soap Operas', wanted: false },
			{ name: 'Videos', wanted: false },
			{ name: 'Mainstream', wanted: false },
			{ name: 'Lyrics', wanted: false }
		];

		$scope.adv = [
			{ name: 'Adv1', wanted: true },
			{ name: 'Adv2', wanted: false },
			{ name: 'Adv3', wanted: true },
			{ name: 'Adv4', wanted: false },
			{ name: 'Adv5', wanted: false }

		];

		$scope.sizes = [
			{ name: '300x250', wanted: true },
			{ name: '468x60', wanted: false },
			{ name: '728x90', wanted: true },
			{ name: '234x60', wanted: false },
			{ name: '800x600', wanted: false }

		];

		$scope.country = [
			{ name: 'Argentina', wanted: true },
			{ name: 'Armenia', wanted: false },
			{ name: 'Aruba', wanted: true }
		];

		// $scope.device = [
		// 	{ name: 'Pc', wanted: true },
		// 	{ name: 'Tablet WIFI', wanted: false },
		// 	{ name: 'Tablet 3g', wanted: true },
		// 	{ name: 'Mobile 3g', wanted: true },
		// 	{ name: 'Mobile WIFI', wanted: true }
		// ];

		// $scope.browser = [
		// 	{ name: 'Chrome', wanted: true },
		// 	{ name: 'Firefox', wanted: false },
		// 	{ name: 'Edge', wanted: true },
		// 	{ name: 'IE', wanted: true },
		// 	{ name: 'Opera', wanted: true }
		// ];

		$scope.OS = [
			{ name: 'Windows', wanted: true },
			{ name: 'Android', wanted: false },
			{ name: 'OSX', wanted: true },
			{ name: 'Linux', wanted: true },
			{ name: 'iOS', wanted: true }
		];

		// $scope.carrier = [
		// 	{ name: 'Movistar', wanted: true },
		// 	{ name: 'Telcel', wanted: false },
		// 	{ name: 'Claro', wanted: true },
		// 	{ name: 'Personal', wanted: true },
		// 	{ name: 'Yoigo', wanted: true }
		// ];

		$scope.viewOffer = function ($event) {
			$mdDialog.show({
				controller: 'offersModalCtrl',
				templateUrl: 'templates/modals/offers_modal.html?v='+versionPanel,
				targetEvent: $event
			})
			.then(function(answer) {
			}, function() {
			});
		}

	}]);

	ctrl.controller('offersModalCtrl', ['$scope', '$mdDialog', function ($scope, $mdDialog) {
		$scope.modal = {
			offer: 'Test Name 1',
			payout: '10'

		};

		$scope.closeModal = function () {
			$mdDialog.hide();
		}

		$scope.selBrowser = 1;

		$scope.browser = [
			{id: 1, name: 'Chrome'},
			{id: 2, name: 'Firefox'},
			{id: 3, name: 'Edge'},
			{id: 4, name: 'Opera'},
			{id: 5, name: 'IE'}
		];

		$scope.selOs = 1;

		$scope.os = [
			{id: 1, name: 'Windows'},
			{id: 2, name: 'Linux'},
			{id: 3, name: 'OSX'}
		]

		$scope.selCountry = 1;

		$scope.country = [
			{id: 1, name: 'Argentina'},
			{id: 2, name: 'Spain'},
			{id: 3, name: 'Mexico'}
		]

		$scope.selSizee = 1;

		$scope.sizee = [
			{id: 1, name: '800x600'},
			{id: 2, name: '300x250'},
			{id: 3, name: '234x90'}
		]

		$scope.selAdv = 1;

		$scope.adv = [
			{id: 1, name: 'Adv1'},
			{id: 2, name: 'Adv2'},
			{id: 3, name: 'Adv3'}
		]

		$scope.selDev = 1;

		$scope.dev = [
			{id: 1, name: 'PC'},
			{id: 2, name: 'Mobile 3g'},
			{id: 3, name: 'Mobile WIFI'},
			{id: 2, name: 'Tablet 3g'},
			{id: 3, name: 'Tablet WIFI'},
		]

	}]);

})();
