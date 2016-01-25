( function () {

	var ctrl = angular.module('CpaCtrl',[]);

	ctrl.controller('cpaCtrl', ['$scope', 'webservice', '$mdDialog', '$location', 'localservice', 'idioma', function ($scope, webservice, $mdDialog, $location, localservice, idioma) {
		$scope.falseip="192.192.192.192";
		// cambiar icono
		var isPublishers = false;
		localservice.broadcast("isPublishers", isPublishers);
		if($location.path() == "/cpa") {
			var path = "CPA";
			localservice.broadcast("titleReady", path);
		}
		$scope.textos = idioma.getTextos();
		var downloadWhitelist = function () {
			webservice.get('/whiteList', function (data) {
				$scope.whitelist = data;
				$scope.advertisers = [];
				var flag;
				for (var i = 0; i < data.length; i++) {
					flag = false;
					for (var j = 0; j < $scope.advertisers.length; j++) {
						if ($scope.advertisers[j].id == data[i].wlAdvertiser) {
							flag = true;
							break;
						}
					};
					if (!flag) {
						$scope.advertisers.push({id: data[i].wlAdvertiser, name: data[i].advName});
					}
				};
			});
		}

		if ($scope.$parent.logged) {
			downloadWhitelist();
		}

		$scope.getWhitelistByAdvertiser = function (id) {
			var output = [];
			for (var i = 0; i < $scope.whitelist.length; i++) {
				if ($scope.whitelist[i].wlAdvertiser == id)
					output.push($scope.whitelist[i]);
			};
			return output;
		}

		$scope.addIp = function (a) {
			var obj = {
				wlAdvertiser: a.id,
				wlIp: a.newIp
			}
			webservice.post('/whiteList', obj, function () {
				a.newIp = '';
				downloadWhitelist();
			});
		}

		$scope.removeIp = function (id, ev) {

			var confirm = $mdDialog.confirm()
				.parent(angular.element(document.body))
				.title('Are you sure?')
				.content('')
				.ariaLabel('Lucky day')
				.ok('Yes')
				.cancel('No')
				.targetEvent(ev);
			$mdDialog.show(confirm).then(function() {
				webservice.remove('/whiteList?id='+id, function () {
					downloadWhitelist();
				});
			}, function() {});
		}

	}]);

})();