( function () {

	var ctrl = angular.module('ReportSettingsController',[]);

	ctrl.controller('reportSettingsController', ['$scope', '$mdDialog', function ($scope, $mdDialog) {

		$scope.confirm = function () {
			$mdDialog.hide();
		}

		$scope.cancel = function () {
			$mdDialog.hide();
		}

	}]);

})();
