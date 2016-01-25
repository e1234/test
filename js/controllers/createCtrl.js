( function () {

	var ctrl = angular.module('CreateCtrl',[]);

	ctrl.controller('createCtrl', function ($scope, $mdDialog, $location, localservice) {

		$scope.myMenu = false;
		var isPublishers = false;
		localservice.broadcast("isPublishers", isPublishers);
		if($location.path() == "/create") {
			var path = "Campaing Create";
			localservice.broadcast("titleReady", path);
		}

		$scope.newItem = function($event) {
			$mdDialog.show({
				controller: 'newItemCtrl',
				templateUrl: 'templates/new_item_modal.html?v='+versionPanel,
				targetEvent: $event,
			})
			.then(function(answer) {
				console.log(answer);
			}, function() {
			});
		};

	});

})();