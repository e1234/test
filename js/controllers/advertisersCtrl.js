( function () {

	var ctrl = angular.module('AdvertisersCtrl',[]);

	ctrl.controller('advertisersCtrl', ['$scope', 'webservice', 'localservice', '$mdDialog', '$mdSidenav', '$location', 'idioma', function ($scope, webservice, localservice, $mdDialog, $mdSidenav, $location, idioma) {
		$scope.openModal = function(ev){
			$mdDialog.show({
				controller: 'advModalCtrl',
				templateUrl: 'templates/modals/adv_modal.html',
				targetEvent: ev,
			})
			.then(function(answer) {
			}, function() {
			});
		}
		$scope.falseAM = ['Lorem Ipsum', 'Dolor Sit Amet', 'Labore et dolore'];
		$scope.showIO = [false, false, false];
		var isPublishers = false;
		localservice.broadcast("isPublishers", isPublishers);
		if($location.path() == "/advertisers") {
			var path = "Advertisers";
			localservice.broadcast("titleReady", path);
		}
		$scope.textos = idioma.getTextos();
		$scope.selectIO = function (k) {
			for (var i = 0; i < $scope.showIO.length; i++) {
				$scope.showIO[i] = false;
			}
			$scope.showIO[k] = true;
		}

		// remover esta chapuza jquery por java script de hombre peludo

		$(".card1-b").click(function(){
    		$("#card1").toggleClass( "at-left" );
			$("#card2").toggleClass( "from-left" );
			// $("#card2").css('width', '100%');
		});

		$(".back-adv").click(function(){
    		$("#card2").toggleClass( "from-left" );
			$("#card1").toggleClass( "at-left" );
			// $("#card2").css('width', '100%');
		});

		// $(".card2-b").click(function(){
    	// 	$("#card2").css('width', '0px');
		// 	$("#card1").css('width', '100%');
		// });






		// $scope.showPixelData = [false, false, false];
		//
		// $scope.clickPixel = function (k) {
		// 	for (var i = 0; i < $scope.showPixelData.length; i++) {
		// 		$scope.showPixelData[i] = false;
		// 	}
		// 	$scope.showPixelData[k] = true;
		// }

		$scope.userIp="192.198.100.101";

		$scope.falseCompany="The company Corp.";
		$scope.falseAddress="Metallica 1234";
		$scope.falseCountry="Argentina";
		$scope.falseAuto="John Doe";
		$scope.falsePhone="+54 223 123456798";
		$scope.falseSkype="johndoe.company";
		$scope.falseemail="johndoe@company.com";




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

})();
