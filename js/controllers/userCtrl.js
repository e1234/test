( function () {
var ctrl = angular.module('UserCtrl',[]);

ctrl.controller('userController', ['$scope', '$mdDialog', 'webservice', 'localservice', '$mdToast', 'idioma', '$location', '$route', function ($scope, $mdDialog, webservice, localservice, $mdToast, idioma, $location, $route) {
		webservice.get('/userLastChange', function (data) {
			$scope.userData = data[0];
			$scope.userFullName = $scope.userData.userName + ' ' + $scope.userData.userLastName;
		})
		$scope.textos = idioma.getTextos();
		$scope.button = false;
		$scope.pass = {};
		$scope.pass.cp = '123';
		$scope.pass.np = '';
		$scope.pass.rp = '';
		$scope.opts = {};
		$scope.opts.lang = localStorage.language;
		$scope.guardarCambios = function () {
			$mdDialog.hide($scope.opts);
			var lang;
			if ($scope.opts.lang == 'eng')
				lang = 'en';
			else
				lang = 'es';
			webservice.put('/user', {userLanguage: lang}, function (data) {
			});
			
			$scope.userData.passwordAuth = $scope.oldPassword;
		
			webservice.put('/user', $scope.userData, function (data) {
				if (!data.status) {
					localservice.toast('Changes saved successfully.');
					$mdDialog.hide();
				} else {
					localservice.toast('Internal server error.');
				}
			});
		}
		

		$scope.changePass = function () {
			if (($scope.pass.np == $scope.pass.rp)&&($scope.pass.np)) {
				webservice.put('/userPassword', {oldPassword: $scope.pass.cp, newPassword: $scope.pass.np}, function (data) {
					if (data[0].status == 200) {
						toast('Password changed');
						$scope.pass.cp = '';
						$scope.pass.np = '';
						$scope.pass.rp = '';
					}else{
						toast('Can\'t change password. Please complete all fields correctly.');
					}
				}, function (err) {
					toast('Can\'t change password. Please complete all fields correctly.');
				});
			}else{
				toast('Passwords doesn\'t match each other');
			}
		}

		var toast = function(text) {
		    $mdToast.show(
		      	$mdToast.simple()
		        	.content(text)
		        	.position('top right')
		        	.hideDelay(3000)
		    );
	  	};

		$scope.exit = function () {
			$mdDialog.hide();
		}

		}]);
})();