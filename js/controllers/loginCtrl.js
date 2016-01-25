( function () {

	var ctrl = angular.module('LoginCtrl',[]);

		ctrl.controller('loginCtrl', function ($scope, webservice, $location, localservice, $route, $mdBottomSheet, $mdToast, idioma){
			/*if (localStorage.logged) {
				$scope.$parent.enter();
			}*/
			$scope.user = '';
			$scope.pass = '';


			$scope.register = false;

			$scope.textos = idioma.getTextos();

			$scope.showGridBottomSheet = function($event) {
				$scope.alert = '';
				$mdBottomSheet.show({
					templateUrl: 'templates/bottom_grid.html?v='+versionPanel,
					controller: 'GridBottomSheetCtrl',
					targetEvent: $event
				}).then(function(clickedItem) {

				});
			};

			if (localStorage.userdata){
				var ud = JSON.parse(localStorage.userdata);
				$scope.user = ud.mail;
				$scope.pass = ud.pass;
			}

			$scope.login = function () {
				var password = $scope.pass;
				if ($scope.remember)
					localStorage.userdata = JSON.stringify({mail: $scope.user, pass: $scope.pass});
				$scope.$parent.loading(true);
				webservice.login($scope.user, password, function () {
	                $scope.$parent.initialLoad(function () {
	                	$route.reload();
	        			$scope.pass = '';
	        			$scope.$parent.loading(false);
	        			$scope.$parent.enter();
	                });
				}, function (data) {
					$scope.$parent.loading(false);
					switch (data.message) {
						case 'login_user_disabled':
							$scope.toast('The user you entered does not have permission to use the system');
							break;
						case 'login_invalid_password':
						case 'login_invalid_user':
							$scope.toast('Invalid email or password.');
							break;
						case 'login_not_validated_email':
							$scope.toast('Check your email inbox to activate your account.');
							break;
						default:
							$scope.toast('Internal server error.');
							break;
					}
				});
			}

			$scope.toast = function(text) {
			    $mdToast.show(
			      	$mdToast.simple()
			        	.content(text)
			        	.position('top right')
			        	.hideDelay(3000)
			    );
		  	};
	    });

		ctrl.controller('GridBottomSheetCtrl', ['$scope', 'webservice', '$mdToast', '$mdBottomSheet', function ($scope, webservice, $mdToast, $mdBottomSheet) {
				$scope.m = {};
				$scope.m.mail = '';
				$scope.recovery = function () {
					var data = {email: $scope.m.mail};
					webservice.postWithOutBearer('/passwordChange', data, function () {
						$mdBottomSheet.hide()
						toast('Email sent successfully.')
					});
				}

				var toast = function(text) {
				    $mdToast.show(
				      	$mdToast.simple()
				        	.content(text)
				        	.position('top right')
				        	.hideDelay(3000)
				    );
			  	};

		}]);

})();