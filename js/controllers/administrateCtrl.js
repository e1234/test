( function () {

	var ctrl = angular.module('AdministrateCtrl',[]);

	ctrl.controller('administrateCtrl', ['$scope', '$mdDialog', '$location', 'localservice','idioma', function ($scope, $mdDialog, $location, localservice, idioma) {
		
		if($location.path() == "/administrate") {
			var path = "Administrate";
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
		  browserNone: ''

	    };

	    $scope.textos = idioma.getTextos();
	    console.log($scope.textos)

	    $scope.newModal = function($event) {
	    	$mdDialog.show({
				controller: 'abTesterCreativityModalCtrl',
				templateUrl: 'templates/modals/abTesterCreativityModal.html?v='+versionPanel,
				targetEvent: $event,
			})
			.then(function() {
			}, function() {
			});
	    }

	    $scope.cloneOk = function() {
	    	$scope.isCloned = true;
	    }

	}]);

	ctrl.controller('abTesterCreativityModalCtrl',['$scope', '$mdDialog', function($scope, $mdDialog) {

		$scope.cancel = function() {
			$mdDialog.hide();
		}
	}]);

})();
