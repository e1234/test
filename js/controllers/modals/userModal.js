( function () {

	var ctrl = angular.module('userModal',[]);

	ctrl.controller('userModalCtrl', ['$scope', '$mdDialog', function ($scope, $mdDialog) {

		$scope.close = function () {
			$mdDialog.hide();
		}
		$scope.falseAM = ['Lorem Ipsum', 'Dolor Sit Amet', 'Labore et dolore'];
		$scope.falseLang = ['Español', 'English'];
		$scope.falseName="John Doe";
		$scope.falsePhone="+54 223 555-5555";
		$scope.falseMail="user-example@example.com";
		$scope.falseIM="user-example@hangouts.com";
		$scope.falseDNI="1.123.456.789";
		$scope.falseCity="Mar del Plata";
		$scope.falseAddress="Address 12345";
		$scope.falseState="Buenos Aires";
		$scope.falseCP="7600";
		$scope.falseNation="Argentina";
		$scope.countries = ['argentina', 'brasil', 'españa'];
		$scope.types = ['Empresa', 'Autonomo', 'Particular'];
		$scope.icon="expand_more";
		$scope.changeIcon=function() {
			if ($scope.icon=="expand_less") {
				$scope.icon="expand_more"

			}
			else {
				$scope.icon="expand_less";
			}
		}
	}]);

}) ();
