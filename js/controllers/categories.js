( function () {
	
	var ctrl = angular.module('categories',[]);

	ctrl.controller('categoriesCtrl', ['$scope', 'webservice', 'localservice', '$location', 'idioma', function ($scope, webservice, localservice, $location, idioma) {
		
		$scope.editing = false;

		if($location.path() == "/categories") {
			var path = "Categories";
			localservice.broadcast("titleReady", path);
		}

		if ($scope.$parent.logged) {

			var cont = 0;

			$scope.textos = idioma.getTextos();

			$scope.createCategory = function(categoryName) {
				if(categoryName != undefined) {
					var obj = {
						"catName": categoryName
					}
					webservice.post('/category', obj , function(data) {
						localservice.toast("Category saved");
					})	
				} else {
					localservice.toast("Please complete the field");
				}
			}

			webservice.get('/categoriesDetailed', function (data) {
				$scope.categories = data;
				for (var i = 0; i < $scope.categories.length; i++) {
					if ($scope.categories[i].catUserVisible == 0)
						$scope.categories[i].catUserVisible = false;
					else
						$scope.categories[i].catUserVisible = true;
				};
				$scope.selectedCategory = 0;
				cont++;
				if (cont == 3)
					$scope.selectCategory($scope.selectedCategory);
			});

			webservice.get('/typeAds', function (data) {
				$scope.typeAds = data;
				for (var i = 0; i < $scope.typeAds.length; i++) {
					$scope.typeAds[i].marked = false;
				};
				cont++;
				if (cont == 3)
					$scope.selectCategory($scope.selectedCategory);
			});

			webservice.get('/channel', function (data) {
				$scope.channels = data;
				for (var i = 0; i < $scope.channels.length; i++) {
					$scope.channels[i].marked = false;
					$scope.channels[i].def = false;
				};
				$scope.selectedChannel = 0;
				$scope.channelSelected = "Movies";
				cont++;
				if (cont == 3)
					$scope.selectCategory($scope.selectedCategory);
			});
		}

		$scope.selectCategory = function (k) {
			$scope.editing = false;
			for (var i = 0; i < $scope.channels.length; i++) {
				$scope.channels[i].marked = false;
				$scope.channels[i].def = false;
				$scope.channels[i].typ = JSON.parse(JSON.stringify($scope.typeAds));
			};
			for (var i = 0; i < $scope.categories[k].channelCategory.length; i++) {
				for (var j = 0; j < $scope.channels.length; j++) {
					if ($scope.channels[j].chaId == $scope.categories[k].channelCategory[i].chaId) {
						$scope.channels[j].marked = true;
						if ($scope.categories[k].channelCategory[i].catchannelDefault) $scope.channels[j].def = true;
						for (var l = 0; l < $scope.categories[k].channelCategory[i].TypeAdsChannel.length; l++) {
							markTypeAd(j, $scope.categories[k].channelCategory[i].TypeAdsChannel[l]);
						};
						break;
					}
				};
			};
			$scope.selectedCategory = k;
		}
		$scope.clog = function (a) {
			console.log(a);
		}

		$scope.selectChannel = function (k) {
			$scope.selectedChannel = k;
			if(k == 0) {
				$scope.channelSelected = "Movies";
			}
			if(k == 1) {
				$scope.channelSelected = "Downloads";
			}
			if(k == 2) {
				$scope.channelSelected = "Sports";
			}
			if(k == 3) {
				$scope.channelSelected= "Music";
			}
			if(k == 4) {
				$scope.channelSelected = "Erotic";
			}
			if(k == 5) {
				$scope.channelSelected = "Books";
			}
			if(k == 6) {
				$scope.channelSelected = "Series and Soap Operas";
			}
			if(k == 7) {
				$scope.channelSelected = "Videos";
			}
			if(k == 8) {
				$scope.channelSelected = "Web de Apps";
			}
			if(k == 9) {
				$scope.channelSelected = "Mainstream";
			}
			if(k == 10) {
				$scope.channelSelected = "Lyrics";
			}
			
		}

		var markChannel = function (id) {
			for (var i = 0; i < $scope.channels.length; i++) {
				if ($scope.channels[i].chaId == id) {
					$scope.channels[i].marked = true;
					break;
				}
			};
		}

		var markTypeAd = function (c, ad) {
			for (var i = 0; i < $scope.channels[c].typ.length; i++) {
				if ($scope.channels[c].typ[i].typId == ad.typId) {
					$scope.channels[c].typ[i].marked = true;
				}
			};
		}

		$scope.markDefault = function (id) {
			var ok = false;
			for (var i = 0; i < $scope.channels.length; i++) {
				if ($scope.channels[i].chaId == id) {
					if ($scope.channels[i].marked) {
						ok = true;
					}
					break;
				}
			};
			if (ok) {
				for (var i = 0; i < $scope.channels.length; i++) {
					if ($scope.channels[i].chaId == id) {
						$scope.channels[i].def = true;
					}else{
						$scope.channels[i].def = false;
					}
				};
			}
		}

		$scope.markDefaultCheck = function (id) {
			if ($scope.editing)
				$scope.markDefault(id);
		}

		$scope.checkChannels = function () {
			var ok = false;
			for (var i = 0; i < $scope.channels.length; i++) {
				if ($scope.channels[i].def && $scope.channels[i].marked) {
					ok = true;
					break;
				}
			}
			if (!ok) {
				var flag = true;
				for (var i = 0; i < $scope.channels.length; i++) {
					if ($scope.channels[i].marked && flag) {
						$scope.channels[i].def = true;
						flag = false;
					}else{
						$scope.channels[i].def = false;
					}
				};
			}
		}

		$scope.getChannelsByCategory = function (k) {
			return $scope.categories[k].channelCategory;
		}

		$scope.getTypeAdsByChannel = function (chaId) {
			return $scope.ads[chaId];
		}

		$scope.editButton = function () {
			if ($scope.editing) {
				$scope.editing = false;
				saveChanges();
			}else{
				$scope.editing = true;
			}
		}

		$scope.editIcon = function () {
			if ($scope.editing)
				return 'save'
			else
				return 'edit'
		}

		var saveChanges = function () {
			var cat = {};
			var cha = {};
			cat.catId = $scope.categories[$scope.selectedCategory].catId;
			cat.channelCategory = [];
			cat.catUserVisible = ($scope.categories[$scope.selectedCategory].catUserVisible?1:0);
			for (var i = 0; i < $scope.channels.length; i++) {
				if ($scope.channels[i].marked) {
					cha = {chaId: $scope.channels[i].chaId, typeAdsChannel: [], catchannelDefault: ($scope.channels[i].def?1:0)};
					for (var j = 0; j < $scope.channels[j].typ.length; j++) {
						if ($scope.channels[i].typ[j].marked)
							cha.typeAdsChannel.push($scope.channels[i].typ[j].typId);
					}
					cat.channelCategory.push(cha);
				}
			};
			console.log(cat);
			webservice.put('/categoriesDetailed', cat, function () {
				localservice.toast('Changes Saved');
				webservice.get('/categoriesDetailed', function (data) {
					$scope.categories = data;
					for (var i = 0; i < $scope.categories.length; i++) {
						if ($scope.categories[i].catUserVisible == 0)
							$scope.categories[i].catUserVisible = false;
						else
							$scope.categories[i].catUserVisible = true;
					};
				});
			}, function () {
				localservice.toast('Can\'t save changes');
			});
		}

	}]);

}) ();