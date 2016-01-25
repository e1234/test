( function () {

	var ctrl = angular.module('CardNameCtrl',[]);

	ctrl.controller('cardNameController', ['$scope', '$mdDialog', 'oldName', function ($scope, $mdDialog, oldName) {

		$scope.scp = {};
		$scope.scp.name = oldName;
		$scope.confirm = function () {
			$mdDialog.hide($scope.scp.name);
		}

		$scope.cancel = function () {
			$mdDialog.hide();
		}

	}]);

})();