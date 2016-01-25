( function () {

	var ctrl = angular.module('advModal',[]);

	ctrl.controller('advModalCtrl', ['$scope', '$mdDialog', function ($scope, $mdDialog) {
		$scope.userIp="192.198.100.101";
		$scope.close = function () {
			$mdDialog.hide();
		}

		$scope.showPixelWindow = false;
		$scope.hideCode = 'hide-code';

		$scope.pixelWindow = function () {
			if ($scope.showPixelWindow) {
				// console.log('falso');
				$scope.showPixelWindow = false;
				setTimeout(function () {
					$scope.hideCode = 'hide-code';
					$scope.$apply();
				}, 400);
			}else{
				// console.log('verdadero');
				$scope.showPixelWindow = true;
				$scope.hideCode = 'show-code';
			}
		}

		$scope.showPixelData = [false, false, false];

		$scope.clickPixel = function (k) {
			for (var i = 0; i < $scope.showPixelData.length; i++) {
				$scope.showPixelData[i] = false;
			}
			$scope.showPixelData[k] = true;
		}

		$scope.class1 = "";
		$scope.class2 = "";
		$scope.class3 = "";

        $scope.changeClass1 = function(){
          if ($scope.class1 === "active-row")
            $scope.class1 = "";
          else
            $scope.class1 = "active-row";
        };

		// $scope.class2 = "active-row";

        $scope.changeClass2 = function(){
          if ($scope.class2 === "active-row")
            $scope.class2 = "";
          else
            $scope.class2 = "active-row";
        };

		// $scope.class3 = "active-row";

		$scope.changeClass3 = function(){
          if ($scope.class3 === "active-row")
            $scope.class3 = "";
          else
            $scope.class3 = "active-row";
        };

	}]);

}) ();
