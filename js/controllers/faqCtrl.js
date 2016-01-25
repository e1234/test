( function () {

	var ctrl = angular.module('faq',[]);

	ctrl.controller('faqCtrl', function ($scope, $mdDialog) {

		$scope.faqModal = function($event) {
			$mdDialog.show({
				controller: 'faqModalController',
				templateUrl: 'templates/modals/faqModal.html?v='+versionPanel,
				targetEvent: $event,
			})
		}

	});

	ctrl.controller('faqModalController',['$scope', '$mdDialog', function ($scope, $mdDialog) {
		
		$scope.closeModal = function() {
			$mdDialog.hide();	
		}
	
	}]);

})();

