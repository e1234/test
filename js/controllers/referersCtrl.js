( function () {

	var ctrl = angular.module('ReferersCtrl',[]);

	ctrl.controller('referersCtrl', ['$scope', 'webservice', 'localservice', '$mdDialog', '$location', 'idioma', function ($scope, webservice, localservice, $mdDialog, $location, idioma) {
		$scope.barTools = false;
		var isPublishers = false;
		localservice.broadcast("isPublishers", isPublishers);
		if($location.path() == "/referers") {
			var path = "Referers";
			localservice.broadcast("titleReady", path);
		}

		$scope.textos = idioma.getTextos();

		var getReferrers = function () {
			webservice.get('/referrer', function (data) {
				$scope.referrers = data;
				$scope.approved = [];
				$scope.pending = [];
				$scope.denied = [];
				for (var i = 0; i < data.length; i++) {
					switch (data[i].rcuStatusId) {
						case 1:
							$scope.approved.push(data[i]);
							break;
						case 2:
							$scope.pending.push(data[i]);
							break;
						case 3:
							$scope.denied.push(data[i]);
							break;
					}
				};
			});
		}

		if ($scope.$parent.logged) {
			getReferrers();
		}

		$scope.changeStatus = function (ev, id, status) {
			var confirm = $mdDialog.confirm()
			  .parent(angular.element(document.body))
			  .title('Esta seguro?')
			  .content('Se cambiará el estado del referido')
			  .ariaLabel('Lucky day')
			  .ok('Si')
			  .cancel('No')
			  .targetEvent(ev);
			$mdDialog.show(confirm).then(function() {
			  setStatus(id, status);
			}, function() {

			});
		}

		var setStatus = function (id, status) {
			webservice.put('/referrerStatus?id='+id, {"rcuStatusId": status}, function (data) {
				getReferrers();
			}, function (data) {
				localservice.toast('Internal server error');
			});
		}

	}]);


	function newItemCtrl ($scope, $mdDialog) {

	}


})();