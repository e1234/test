(function () {
	
	var ctrl = angular.module('report',[]);

	ctrl.controller('reportCtrl', function ($scope, webservice, $document, $location, localservice, $mdDialog, db, uiGridConstants, $timeout, socketio, reportService, $interval, $rootScope, cardService, idioma, timezone) {

		//if($location.path() == "/report") {
			var path = "Reports";
			localservice.broadcast("titleReady", path);
		//}

		$scope.url = '';
		$scope.downloadName = '';

		$scope.range = 'none';
		$scope.waitingReports = true;
		$scope.pkey = {};
		$scope.pkey.pubSel = 0;

		$scope.reports = [];

		$scope.loadingReport = false;

		$scope.textos = idioma.getTextos();
		var checkdb = true;
		$scope.downloadeds = {};
		$scope.$on('newCards', function ($event, data) {
			$scope.waitingReports = false;
			$scope.gettingReport = false;
			$scope.reports = data;
			var cont = 0;
				$scope.reports.forEach(function(report) {
					if (report.state == 'Ready') {
						if ($scope.downloadeds[report.number])
							report.state = 'Ready';
						else
							report.state = 'Ready for download';
					}
					if (checkdb) {
						db.checkTable(report.number).then(function (ok) {
							if (!ok) report.state = 'Ready for download';
							else {
								report.state = 'Ready';
								$scope.downloadeds[report.number] = true;
							}
							cont++;
							if (cont == $scope.reports.length) {
								if(!$scope.$$phase) {
								 	$scope.$apply();
								}
							}
						});
					}
				});
				checkdb = false;
		});

		var temporalCard = function () {
			var c = {};
			c.number = 'New report';
			c.reportName = 'New Report';
			c.state = 'Requesting report'
			$scope.reports.push(c);
		};

		$scope.$watch(function () { return $scope.publishersPreFilter }, function (filter) {
			$scope.pkey.pubSel = 0;
			if (filter.length >= 1) {
				$scope.pubCant = 20;
				var resumen = '';
				var resumenOculto = '';
				$scope.filteredPublishers = [];
				for (var i = 0; i < $scope.publishers.length; i++) {
					resumen = $scope.publishers[i].userId+' - '+$scope.publishers[i].userEmail+' '+$scope.publishers[i].userName+' '+$scope.publishers[i].userLastName;
					resumenOculto = resumen;
					for (var j = 0; j < $scope.publishers[i].userWebsiteData.length; j++) {
						resumenOculto += ' '+$scope.publishers[i].userWebsiteData[j].webUrl;
					};
					var res = resumenOculto.toLowerCase();
					var fil = filter.toLowerCase();
					if (res.indexOf(fil) > -1) {
						$scope.publishers[i].resumen = resumen;
						$scope.publishers[i].resumenOculto = resumenOculto;
						$scope.filteredPublishers.push($scope.publishers[i]);
					}
				};
			}else{
				$scope.filteredPublishers = [];
			}
		});

		$scope.keypressPublisher = function (ev) {
			switch (ev.keyCode) {
				case 38:
					if ($scope.pkey.pubSel) $scope.pkey.pubSel--;
					break;
				case 40:
					if (($scope.filteredPublishers.length-1)>=($scope.pkey.pubSel)) $scope.pkey.pubSel++;
					break;
				case 13:
					$scope.addPub($scope.filteredPublishers[$scope.pkey.pubSel]);
					break;
				default:
					break;
			}
		}

		var pubRemove = function (pub) {
			for (var i = 0; i < $scope.publishers.length; i++) {
				if ($scope.publishers[i].userId == pub.userId) {
					$scope.publishers.splice(i, 1);
				}
			};
		}

		var pubAdd = function (pub) {
			$scope.publishers.push(pub);
		}

		$scope.addPub = function (pub) {
			if (pub) {
				$scope.publisherFilter.push(pub);
				$scope.publishersPreFilter = '';
				pubRemove(pub);
				if (!($scope.selecteds.websiteFilter.length)) {
					webservice.get('/websiteUserId?id='+pub.userId, function (data) {
						if ($scope.publisherFilter.length == 1) $scope.websitesByPublisher = [];
						$scope.websitesByPublisher = $scope.websitesByPublisher.concat(data);
						setTimeout(function () {
							$('#websites-multiple').trigger('chosen:updated');
						}, 500);
					});
				}
				webservice.get('/adsUserId?id='+pub.userId, function (data) {
					$scope.adsByPublisher = $scope.adsByPublisher.concat(data);
					setTimeout(function () {
						$('#ads-multiple').trigger('chosen:updated');
					}, 500);
				});
			}
		}

		$scope.removePub = function (index) {
			var p = $scope.publisherFilter[index];
			pubAdd(p);
			$scope.publisherFilter.splice(index, 1);
		}

		$scope.pubCant = 20;

		$scope.morePub = function () {
			$scope.pubCant += 20;
		}

		//filtros websites

		$scope.wkey = {};
		$scope.wkey.webSel = 0;

		$scope.$watch(function () { return $scope.selecteds.websitesPreFilter }, function (filter) {
			$scope.wkey.webSel = 0;
			if (filter.length >= 1) {
				var resumen = '';
				$scope.filteredWebsites = [];
				for (var i = 0; i < $scope.websites.length; i++) {
					resumen = $scope.websites[i].webId+' - '+$scope.websites[i].webUrl+' - '+$scope.websites[i].webUserData.userEmail;
					var res = resumen.toLowerCase();
					var fil = filter.toLowerCase();
					if (res.indexOf(fil) > -1) {
						$scope.websites[i].resumen = resumen;
						$scope.filteredWebsites.push($scope.websites[i]);
					}
				}
			}else{
				$scope.filteredWebsites = [];
			}
		});

		$scope.removeWeb = function (index) {
			var w = $scope.selecteds.websiteFilter[index];
			webAdd(w);
			$scope.selecteds.websiteFilter.splice(index, 1);
		}

		$scope.addWeb = function (web) {
			if (web) {
				$scope.selecteds.websiteFilter.push(web);
				$scope.selecteds.websitesPreFilter = '';
				webRemove(web);
				webservice.get('/adsWebsiteId?id='+web.webId, function (data) {
					$scope.adsByPublisher = $scope.adsByPublisher.concat(data);
					setTimeout(function () {
						$('#ads-multiple').trigger('chosen:updated');
					}, 500);
				});
			}
		}

		$scope.resetWebsiteFilter = function () {
			if ($scope.selecteds.websitesPreFilter.length) {
				$scope.selecteds.websitesPreFilter = '';
			}
		}

		var webRemove = function (web) {
			for (var i = 0; i < $scope.websites.length; i++) {
				if ($scope.websites[i].webId == web.webId) {
					$scope.websites.splice(i, 1);
					break;
				}
			};
		}

		var webAdd = function (web) {
			console.log('la mete', web);
			$scope.websites.push(web);
		}

		$scope.webCant = 20;

		$scope.moreWeb = function () {
			$scope.webCant += 20;
		}

		$scope.keypressWebsite = function (ev) {
			switch (ev.keyCode) {
				case 38:
					if ($scope.wkey.webSel) $scope.wkey.webSel--;
					break;
				case 40:
					if (($scope.filteredWebsites.length-1)>=($scope.wkey.webSel)) $scope.wkey.webSel++;
					break;
				case 13:
					$scope.addWeb($scope.filteredWebsites[$scope.wkey.webSel]);
					break;
				case 27:
					$scope.selecteds.websitesPreFilter = '';
					break;
				default:
					break;
			}
		}

		//filtros offer

		$scope.okey = {};
		$scope.okey.offSel = 0;

		$scope.$watch(function () { return $scope.offersPreFilter }, function (filter) {
			$scope.pkey.offSel = 0;
			if (filter.length >= 1) {
				$scope.offCant = 20;
				var resumen = '';
				var resumenOculto = '';
				$scope.filteredOffers = [];
				for (var i = 0; i < $scope.offers.length; i++) {
					resumen = $scope.offers[i].offerId+' - '+$scope.offers[i].offerName;
					var res = resumen.toLowerCase();
					var fil = filter.toLowerCase();
					if (res.indexOf(fil) > -1) {
						$scope.offers[i].resumen = resumen;
						$scope.filteredOffers.push($scope.offers[i]);
					}
				};
			}else{
				$scope.filteredOffers = [];
			}
		});

		$scope.keypressOffers = function (ev) {
			switch (ev.keyCode) {
				case 38:
					if ($scope.okey.offSel) $scope.okey.offSel--;
					break;
				case 40:
					if (($scope.filteredOffers.length-1)>=($scope.okey.offSel)) $scope.okey.offSel++;
					break;
				case 13:
					$scope.addOffer($scope.filteredOffers[$scope.okey.offSel]);
					break;
				default:
					break;
			}
		}

		var offerRemove = function (off) {
			for (var i = 0; i < $scope.offers.length; i++) {
				if ($scope.offers[i].offerId == off.offerId) {
					$scope.offers.splice(i, 1);
				}
			};
		}

		var offerAdd = function (off) {
			$scope.offers.push(off);
		}

		$scope.addOffer = function (off) {
			if (off) {
				$scope.selecteds.offersFilter.push(off);
				$scope.offersPreFilter = '';
				offerRemove(off);
			}
		}

		$scope.removeOffer = function (index) {
			var o = $scope.selecteds.offersFilter[index];
			offerAdd(o);
			$scope.selecteds.offersFilter.splice(index, 1);
		}

		$scope.offCant = 20;

		$scope.moreOffers = function () {
			$scope.offCant += 20;
		}

		//filtros line items

		$scope.lkey = {};
		$scope.lkey.liSel = 0;

		$scope.$watch(function () { return $scope.selecteds.liPreFilter }, function (filter) {
			$scope.filteredLi = [];
			if (filter.length == 3) {
				webservice.get('/lineItemName?name='+filter, function (data) {
					for (var i = 0; i < data.length; i++) {
						data[i].resumen = data[i].liId+' - '+data[i].liName;
					}
					$scope.lis = data;
					$scope.filteredLi = data;
				});
			}else{
				if ((filter.length > 3) && ($scope.lis)) {
					$scope.filteredLi = [];
					for (var i = 0; i < $scope.lis.length; i++) {
						var res = $scope.lis[i].resumen.toLowerCase();
						var fil = filter.toLowerCase();
						if (res.indexOf(fil) > -1) {
							$scope.filteredLi.push($scope.lis[i]);
						}
					};
				}
			}
		});

		$scope.resetLiFilter = function () {
			if ($scope.selecteds.liPreFilter.length) {
				$scope.selecteds.liPreFilter = '';
			}
		}

		$scope.addLi = function (li) {
			$scope.liFilter.push(li);
			$scope.filteredLi.splice($scope.lkey.liSel, 1);
			//$scope.selecteds.liPreFilter = '';
		}

		$scope.removeLi = function (index) {
			$scope.liFilter.splice(index, 1);
		}

		$scope.keypressLi = function (ev) {
			switch (ev.keyCode) {
				case 38:
					if ($scope.lkey.liSel) $scope.lkey.liSel--;
					break;
				case 40:
					if (($scope.filteredLi.length-1)>=($scope.lkey.liSel)) $scope.lkey.liSel++;
					break;
				case 13:
					ev.stopPropagation();
					$scope.addLi($scope.filteredLi[$scope.lkey.liSel]);
					break;
				case 27:
					$scope.selecteds.liPreFilter = '';
					break;
				default:
					break;
			}
		}

		$scope.logKey = function (k) {
			console.log(k);
		}

		$scope.tabs = [{
			name: 'Generate',
			clase: 'my-tab',
			zIndex: 1,
			disabled: '',
			timestamp: new Date().getTime(),
			filterTab: true
		}];

		$scope.closeTabMenu = function () {
			for (var i = $scope.tabs.length - 1; i >= 0; i--) {
				$scope.tabs[i].tabMenu = false;
			};
		}

		$scope.openTabMenu = function (k, ev) {
			$scope.tabMenuLeft = ev.offsetX+33;
			$scope.tabMenuTop = ev.offsetY-31;
			ev.stopPropagation();
			for (var i = $scope.tabs.length - 1; i >= 0; i--) {
				$scope.tabs[i].tabMenu = false;
			};
			$scope.tabs[k].tabMenu = true;
		}

		$scope.layout = false;

		$scope.horas = false;

		$scope.sidebarView = 'chevron_left';
		$scope.changeIcon = function () {
			if ($scope.sidebarView == 'chevron_left') {
				$scope.sidebarView = 'chevron_right';
				$scope.sideBar = false;
			}else{
				$scope.sidebarView = 'chevron_left';
				$scope.sideBar = true;
			}
		}

		$scope.sidebarHover = function () {
			$scope.sideBar = true;
		}

		if (localStorage.pin) {
			$scope.pin = localStorage.pin;
			if ($scope.pin == 'pin') {
				$scope.sideBar = true;
			}else{
				$scope.sideBar = false;
			}
		}else{
			$scope.pin = 'pinoff';
			$scope.sideBar = false;
		}

		$scope.sidebarLeft = function () {
			if ($scope.pin != 'pin')
				$scope.sideBar = false;
		}

		$scope.pinSidebar = function () {
			if ($scope.pin == 'pin') {
				$scope.pin = 'pinoff';
				localStorage.pin = 'pinoff';
				$scope.sideBar = false;
			}else{
				$scope.pin = 'pin';
				localStorage.pin = 'pin';
				$scope.sideBar = true;
			}
		}

		$scope.dateValue1 = new Date();
		$scope.dateValue2 = new Date();

		$scope.setToday = function () {
			$scope.dateValue1 = new Date();
			$scope.dateValue2 = new Date();
		}

		$scope.setL7D = function () {
			var nd = moment().subtract(6, 'days');
			$scope.dateValue1 = nd.toDate();
			$scope.dateValue2 = new Date();
		}

		$scope.setL15D = function () {
			var nd = moment().subtract(14, 'days');
			$scope.dateValue1 = nd.toDate();
			$scope.dateValue2 = new Date();
		}

		$scope.setCM = function () {
			var nd = moment().startOf('month');
			$scope.dateValue1 = nd.toDate();
			$scope.dateValue2 = new Date();
		}

		var token = '';
		var client = null;
		if ($scope.$parent.logged) {
			webservice.get('/channel', function (data) {
				$scope.channels = data;
			});
			function callbackWebsitesLocalStorage(data) {
				$scope.websites = data;
			}

			function callbackFallaWebsitesLocalStorage() {
				$scope.$on("websitesReady",function (event, data) {
					$scope.websites = data;
				})
			}
			
			localservice.get("publishers", callbackWebsitesLocalStorage, callbackFallaWebsitesLocalStorage);
			webservice.get('/country', function (data) {
				$scope.countries = data;
			});
			webservice.get('/size', function (data) {
				$scope.sizes = data;
			});
			/*webservice.get('/device', function (data) {
				$scope.devices = data;
			});*/
			/*webservice.get('/version', function (data) {
				$scope.versions = data;
			});*/
			webservice.get('/rankTypes', function (data) {
				$scope.versions = data;
			});
			webservice.get('/platform', function (data) {
				$scope.platforms = data;
			});
			webservice.get('/advertiser', function (data) {
				$scope.advertisers = data;
			});
			webservice.get('/browser', function (data) {
				$scope.browsers = data;
			});
			webservice.get('/tries', function (data) {
				$scope.tries = data;
			});
			webservice.get('/carrier', function (data) {
				$scope.carriers = data;
			});
			webservice.get('/hash', function (data) {
				$scope.hashes = data;
			});
			webservice.get('/offer', function (data) {
				$scope.offers = data;
			});

			var refreshTime = function () {
				setTimeout(function () {
					webservice.get('/timeReport', function (data) {
						if (data[0].date != null) {
							$scope.lastUpdate = new Date(data[0].date);
						}
						refreshTime();
					});
				}, 120000);
			}

			webservice.get('/timeReport', function (data) {
				if (data[0].date != null) {
					$scope.lastUpdate = new Date(data[0].date);
					$scope.dateValue1 = $scope.lastUpdate;
					$scope.dateValue2 = $scope.lastUpdate;
				}
				refreshTime();
			});

			function callbackPublishersLocalStorage(data) {
				$scope.publishers = data;
			}

			function callbackFallaPublishersLocalStorage() {
				$scope.$on("publishersReady",function (event, data) {
					$scope.publishers = data;
				})
			}
			
			localservice.get("publishers", callbackPublishersLocalStorage, callbackFallaPublishersLocalStorage);

			webservice.get('/accountManagerAll', function (data) {
				$scope.accountManagers = data;
			});
			webservice.get('/accountManagerAll?advertiser=1', function (data) {
				$scope.advManagers = data;
			});
			localservice.get('user', function (data) {
				$scope.user = data[0];
			});
			$scope.timezones = timezone.list;
			/*var tz = -12;
			while (tz<=14) {
				$scope.timezones.push(tz);
				tz++;
			}*/
			$scope.timezone = $scope.timezones[25];
			$scope.devices = [{deviceAlias: 1, deviceId: 1, deviceName: 'Desktop'}, {deviceAlias: 2, deviceId: 2, deviceName: 'Smartphone'}, {deviceAlias: 3, deviceId: 3, deviceName: 'Tablet'}];
			$scope.connections = [{id: 1, name: 'Terrestrial'}, {id: 2, name: 'Mobile'}];
			$scope.hours = localservice.hours;
			token = webservice.token;
			socketio.socketInit();
		}

		var toUTCDate = function(date){
	   		var _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
	    	return _utc;
	  	};

		var millisToUTCDate = function(millis){
			return toUTCDate(new Date(millis));
		};

		$scope.toUTCDate = toUTCDate;
		$scope.millisToUTCDate = millisToUTCDate;

		$scope.selecteds = {};
		$scope.publishersPreFilter = '';
		$scope.selecteds.publisherSelected = '';
		$scope.filteredPublishers = [];
		$scope.publisherFilter = [];
		$scope.selecteds.websitesPreFilter = '';
		$scope.filteredWebsites = [];
		$scope.selecteds.websiteFilter = [];
		$scope.filteredOffers = [];
		$scope.selecteds.offersFilter = [];
		$scope.websitesByPublisher = [];
		$scope.adsByPublisher = [];
		$scope.selecteds.sectionsFilter = [];
		$scope.selectedHours = [];
		$scope.selecteds.liPreFilter = '';
		$scope.filteredLi = [];
		$scope.liFilter = [];
		$scope.selecteds.creativeFilter = [];
		for (var i = 0; i < 24; i++) {
			$scope.selectedHours[i] = false;
		};




		$scope.addSection = function () {
			$scope.selecteds.sectionsFilter.push($scope.adId);
			$scope.adId = '';
		}

		$scope.addCreative = function () {
			$scope.selecteds.creativeFilter.push($scope.creativeId);
			$scope.creativeId = '';
		}

		$scope.removeSection = function (index) {
			$scope.selecteds.sectionsFilter.splice(index, 1);
		}

		$scope.removeCreative = function (index) {
			$scope.selecteds.creativeFilter.splice(index, 1);
		}

		$scope.abrirHoras = function () {
			$scope.horas = !$scope.horas;
		}

		$scope.openModal = function ($event) {
			$mdDialog.show({
				controller: settingsController,
				templateUrl: 'templates/settings.html?v='+versionPanel,
				targetEvent: $event
			})
			.then(function(answer) {
			}, function() {
			});
		};

		$scope.clkHour = function (h) {
			$scope.selectedHours[h.time] = !$scope.selectedHours[h.time];
		}

		$scope.selHour = function (h, e) {
			if (e.buttons)
				$scope.selectedHours[h.time] = !$scope.selectedHours[h.time];
		}

		$scope.markAll = function (val) {
			for (var i = 0; i < $scope.selectedHours.length; i++) {
				$scope.selectedHours[i] = val;
			};
		}

		$scope.close = function () {
			$mdDialog.hide();
		}

		$scope.getMargin = function (k) {
			if (k)
				return '-15px'
			return '0px'
		}

		$scope.selectedTab = 0;
		$scope.config = null;
		$scope.doubleLayout = false;

		$scope.selectTab = function (k, elim, nueva) {
			if (!elim) {
				/*$scope.tabs[$scope.selectedTab].clase = 'my-tab-disabled';
				$scope.tabs[$scope.selectedTab].zIndex = $scope.tabs.length-$scope.selectedTab-1;
				$scope.tabs[$scope.selectedTab].disabled = '-d';*/
				$scope.old = $scope.selectedTab;
				if ($scope.tabs[$scope.old].filterTab && !nueva) {
					saveCard(null, null, $scope.old);
				}
			}
			for (var i = 0; i < $scope.tabs.length; i++) {
				$scope.tabs[i].clase = 'my-tab-disabled';
				$scope.tabs[i].zIndex = $scope.tabs.length-i;
				$scope.tabs[i].disabled = '-d';
			};
			$scope.tabs[k].clase = 'my-tab';
			$scope.tabs[k].zIndex = $scope.tabs.length+1;
			$scope.tabs[k].disabled = '';
			var actCard;
			if ($scope.tabs[$scope.selectedTab]) {
				actCard = $scope.tabs[$scope.selectedTab].card;
			}
			var card = $scope.tabs[k].card;
			var card2 = $scope.tabs[k].card2;
			if (actCard) {
				if ($scope.gridApi && $scope.old) {
					if ($scope.tabs[$scope.old].card) {
						$scope.tabs[$scope.old].card.config = $scope.gridApi.saveState.save();
					}
				}
			}
			if (card) {
				$scope.tabs[k].loading1 = true;
				db.getTable(card.number).then(function (table) {
					$scope.tabs[k].loading1 = false;
					if (table.table.data.length == 0) {
						toast('Empty report. Please check your filters.')
						table.table.columnDefs = [{ name: 'Empty', field: 'Empty', width: 400, myOrder: 0}];
						table.table.data = [{'Empty': 'Empty report. Please check your filters.'}];
					}
					$scope.footer = table.footer;
				    if (!$scope.tableData) {
				    	$scope.tableData = table.table;
				    	$scope.tableData.onRegisterApi = function (gridApi) {
					      	$scope.gridApi = gridApi;
					      	gridApi.core.on.rowsRendered($scope, function(){
				      	        var shouldShow;
				      	        columnWidth = 0;
				      	        angular.forEach(gridApi.grid.columns, function(column){
				      	          columnWidth += column.drawnWidth;
				      	        });
				      	        if ( !isNaN(columnWidth) && columnWidth > gridApi.grid.gridWidth){
				      	          shouldShow = uiGridConstants.scrollbars.ALWAYS;
				      	        }
				      	        else { shouldShow = uiGridConstants.scrollbars.NEVER; }
				      	        if (shouldShow !== gridApi.grid.options.enableHorizontalScrollbar){
				      	          gridApi.grid.options.enableHorizontalScrollbar = shouldShow;
				      	          gridApi.core.queueGridRefresh();
				      	        }
			      	      	});
					    }
				    }
				    $scope.tableData.data = table.table.data;
				    $scope.tableData.columnDefs = table.table.columnDefs;
			    	if (card.config) {
			    		$scope.config = card.config;
			    		$timeout(function () {
			    			$scope.gridApi.saveState.restore( $scope, $scope.config );
			    		}, 1);
			    	}else
			    		$scope.config = null;
			    	setWidth(table.table.columnDefs.length);
				}, function (err) {
				});
			}else{
				if ($scope.tableData)
					$scope.tableData.data = null;
			}
			if (card2 || $scope.tabs[k].editMode) {
				if ($scope.layout) {
					$scope.w1 = '50%';
					$scope.w2 = '50%';
					$scope.h1 = '100%';
					$scope.h2 = '100%';
				}else{
					$scope.w1 = '100%';
					$scope.w2 = '100%';
					$scope.h1 = '50%';
					$scope.h2 = '50%';
				}
				if (card2) {
					$scope.doubleLayout = true;
					db.getTable(card2.number).then(function (table) {
						$scope.footer2 = table.footer;
					    if (!$scope.tableData2) {
					    	$scope.tableData2 = table.table;
					    	$scope.tableData2.onRegisterApi = function (gridApi) {
						      	$scope.gridApi2 = gridApi;
						    }
					    }
					    $scope.tableData2.data = table.table.data;
					    $scope.tableData2.columnDefs = table.table.columnDefs;
					    setWidth2(table.table.columnDefs.length);
					}, function (err) {
					});
				}
			}else{
				$scope.h1 = '100%';
				$scope.w1 = '100%';
				$scope.doubleLayout = false;
				if ($scope.tableData2)
					$scope.tableData2.data = null;
			}
			$scope.selectedTab = k;
			if ($scope.tabs[k].filterTab) {
				if ($scope.tabs[k].filters)
					loadFilters($scope.tabs[k]);
				else
					loadBlank();
			}else{
				if ($scope.tabs[$scope.selectedTab].card)
					loadFilters($scope.tabs[$scope.selectedTab].card);
			}
			if (k === 0) {
				if ($scope.tableData)
					$scope.tableData.data = null;
				if ($scope.tableData2)
					$scope.tableData2.data = null;
				$scope.doubleLayout = false;
			}
			/*if (k && $scope.tables) {
				setWidth($scope.tables[k-1].table.columnDefs.length);
			}*/
		}

		$scope.selectWhenDelete = function (k) {
			/*$scope.tabs[k].clase = 'my-tab';
			$scope.tabs[k].zIndex = $scope.tabs.length;
			$scope.tabs[k].disabled = '';*/
			$scope.selectTab(k, true);
			/*if (k && $scope.tables) {
				setWidth($scope.tables[k-1].table.columnDefs.length);
			}*/
		}

		var startY = 0;
		var startX = 0;
		var moving = false;
		var offset = 0;
		$scope.h1 = '100%';
		$scope.h2 = '100%';
		$scope.w1 = '100%';
		$scope.w2 = '100%';
		var y1 = 0;
		var y2 = 0;
		var x1 = 0;
		var x2 = 0;
		var y3 = 0;

		$scope.vertical = function () {
			$scope.layout = true;
			$scope.h1 = '100%';
			$scope.h2 = '100%';
			$scope.w1 = '50%';
			$scope.w2 = '50%';
		}

		$scope.horizontal = function () {
			$scope.layout = false;
			$scope.h1 = '50%';
			$scope.h2 = '50%';
			$scope.w1 = '100%';
			$scope.w2 = '100%';
		}

		$scope.mousedown = function (ev) {
			ev.stopPropagation();
			$scope.resizing = true;
			moving = true;
			startY = ev.clientY;
			startX = ev.clientX;
			y1 = $scope.one + 215;
			if ($scope.tabs[$scope.selectedTab].editMode)
				y2 = $scope.two;
			else
				y2 = $scope.three;
			y3 = y1 + y2;
		}

		$scope.mousemove = function (ev) {
			if ($scope.layout) {
				/*if (moving) {
					ev.stopPropagation();
					offset = startX-ev.clientX;
					x1 = startX - offset;
					x2 = startX + offset;
					$scope.w1 = x1 + 'px';
					$scope.w2 = x2 + 'px';
				}*/
				if (moving) {
					ev.stopPropagation();
					offset = startX-ev.clientX;
					x1 = startX - offset;
					x2 = startX + offset;
					x3 = x1+x2;
					$scope.w1 = (x1 * 100 / x3) + '%';
					$scope.w2 = (100 - (x1 * 100 / x3)) + '%';
				}
			}else{
				if (moving) {
					ev.stopPropagation();
					offset = startY-ev.clientY;
					y1 = startY - offset;
					y2 = startY + offset;
					/*$scope.h1 = y1 + 'px';
					$scope.h2 = y2 + 'px';*/
					$scope.h1 = (y1 * 100 / y3) + '%';
					$scope.h2 = (100 - (y1 * 100 / y3)) + '%';
				}
			}
		}

		$scope.mouseup = function () {
			$scope.resizing = false;
			moving = false;
		}

		$scope.editMode = function () {
			$scope.layout = false;
			$scope.tabs[$scope.selectedTab].editMode = true;
			$scope.h1 = '50%';
			loadFilters($scope.tabs[$scope.selectedTab].card);
		}

		$scope.cancelEdit = function () {
			$scope.h1 = '100%';
			$scope.w1 = '100%';
			$scope.tabs[$scope.selectedTab].editMode = false;
		}

		$scope.addTab = function (card, load) {
			var sufix = '';
			var cont = 0;
			if (card) {
				for (var i = $scope.tabs.length - 1; i >= 0; i--) {
					if ($scope.tabs[i].name == card.reportName)
						cont++;
				}
				if (cont)
					sufix = '#'+cont;
				var newTab = {
					name: card.reportName,
					sufix: sufix,
					clase: 'my-tab-disabled',
					zIndex: 0,
					disabled: '-d',
					timestamp: new Date().getTime(),
					card: card
				}
				//if (card.autoOpen)
				$scope.tabs.push(newTab);
				$scope.selectTab($scope.tabs.length-1);
				for (var i = 0; i < $scope.tabs.length-1; i++) {
					$scope.tabs[i].zIndex++;
				};
			} else {
				for (var i = $scope.tabs.length - 1; i >= 0; i--) {
					if ($scope.tabs[i].name == 'Generate')
						cont++;
				}
				if (cont)
					sufix = '#'+cont;
				var newTab = {
					name: 'Generate',
					sufix: sufix,
					clase: 'my-tab-disabled',
					zIndex: 0,
					disabled: '-d',
					timestamp: new Date().getTime(),
					filterTab: true
				}
				saveCard(null, null, $scope.selectedTab, true);
				$scope.tabs.push(newTab);
				$scope.selectTab($scope.tabs.length-1, null, true);
				for (var i = 0; i < $scope.tabs.length-1; i++) {
					$scope.tabs[i].zIndex++;
				};
				if (load)
					loadFilters(load);
			}
		}

		$scope.openIn = function (c, k) {
			if ($scope.tabs[k].card)
				$scope.tabs[k].card2 = c;
			else
				$scope.tabs[k].card = c;
			if ($scope.selectedTab == k)
				$scope.selectTab(k);
		}

		$scope.removeTab = function (k) {
			if (k) {
				//db.deleteTab($scope.tabs[k].timestamp);
				$scope.tabs.splice(k, 1);
				//if (k==$scope.selectedTab)
					$scope.selectWhenDelete(k-1);
			}
		}

		$scope.onDropComplete = function (index, obj, evt) {
			var otherObj = $scope.reports[index];
			var otherIndex = $scope.reports.indexOf(obj);
			$scope.reports[index] = obj;
			$scope.reports[otherIndex] = otherObj;
		}

		$scope.tableHeight = '580px';

		$scope.tableWidth = '1000px';

		var setWidth = function (n) {
			var w = n*80;
			$scope.tableWidth = (w+500)+'px';
		}

		var setWidth2 = function (n) {
			var w = n*80;
			$scope.tableWidth2 = (w+500)+'px';
		}

		$scope.changeTabName = function (k, name) {
			$scope.tabs[k].name = name;
			$scope.tabs[k].sufix = '';
			var newObj = JSON.parse(JSON.stringify($scope.tabs[k]));
			newObj.clase = 'my-tab-disabled';
			newObj.zIndex = $scope.tabs.length-1-k;
			newObj.disabled = '-d';
			//db.putTab(newObj);
		}
		$scope.preFilterData = [];
		$scope.preFilters = false;
		$scope.abrirFiltros = function () {
			if (!$scope.preFilters) {
				$scope.preFilters = true;
				$timeout(function() {
				    $scope.preFilterData = $scope.preFilterData;
				}, 10);
			}else{
				setTimeout(function () {
					$scope.preFilters = false;
					$scope.$apply();
				}, 500);
				//$scope.preFilterData = [];
			}
		}

		var generatePreFilters = function () {
			$scope.preFilterData = [
				{
					name: 'clicks',
					viewName: 'Clicks',
					status: true
				},{
					name: 'clicksu',
					viewName: 'Unique Clicks',
					status: true
				},{
					name: 'conversionRateClicks',
					viewName: 'Conversion Rate Clicks',
					status: true
				},{
					name: 'conversionRateImps',
					viewName: 'Conversion Rate Imps',
					status: true
				},{
					name: 'conversions',
					viewName: 'Conversions',
					status: true
				},{
					name: 'convs_2',
					viewName: 'Conversions 2',
					status: false
				},{
					name: 'convs_3',
					viewName: 'Conversions 3',
					status: false
				},{
					name: 'cost',
					viewName: 'Cost',
					status: true
				},{
					name: 'costEcpm',
					viewName: 'Cost eCPM',
					status: true
				},{
					name: 'ctr',
					viewName: 'CTR',
					status: true
				},{
					name: 'defaults',
					viewName: 'Defaults',
					status: true
				},{
					name: 'impressions',
					viewName: 'Impressions',
					status: true
				},{
					name: 'impsn',
					viewName: 'Network Impressions',
					status: true
				},{
					name: 'impsu',
					viewName: 'Unique Impressions',
					status: true
				},{
					name: 'profit',
					viewName: 'Profit',
					status: true
				},{
					name: 'profitEcpm',
					viewName: 'Profit eCPM',
					status: true
				},{
					name: 'revenue',
					viewName: 'Revenue',
					status: true
				},{
					name: 'revenueEcpm',
					viewName: 'Revenue eCPM',
					status: true
				},{
					name: 'revenue2',
					viewName: 'Revenue 2',
					status: false
				},{
					name: 'revenue2Ecpm',
					viewName: 'Revenue 2 eCPM',
					status: false
				},{
					name: 'revenue3',
					viewName: 'Revenue 3',
					status: false
				},{
					name: 'revenue3Ecpm',
					viewName: 'Revenue 3 eCPM',
					status: false
				},{
					name: 'revenueEcpc',
					viewName: 'Revenue eCPC',
					status: true
				},{
					name: 'revenueShare',
					viewName: 'Revenue Share',
					status: true
				},{
					name: 'revenueShareProfit',
					viewName: 'Revenue Share Profit',
					status: true
				},{
					name: 'wrongReferers',
					viewName: 'Wrong Referrers',
					status: true
				}
			];
		}

		if (localStorage.columns) {
			var pre = JSON.parse(localStorage.columns);
			if (pre.length) {
				if (pre[0].viewName)
					$scope.preFilterData = pre;
				else
					generatePreFilters();
			}else{
				generatePreFilters();	
			}
		} else {
			generatePreFilters();
		}

		$scope.markAllCol = function () {
			for (var i = 0; i < $scope.preFilterData.length; i++) {
				$scope.preFilterData[i].status = true;
			};
		}

		$scope.unmarkAllCol = function () {
			for (var i = 0; i < $scope.preFilterData.length; i++) {
				$scope.preFilterData[i].status = false;
			};
		}

		$scope.broadMenu = function (ev) {
			localservice.broadcast('openMenu', $scope.xvalue);
		}

		$scope.getTabIcon = function (k) {
			if ($scope.tabs[k].filterTab)
				return 'filter_list'
			else
				return 'subject'
		}

		$scope.openWhenReady = true;

		$scope.actFilters = {};

		var saveCard = function (c, key, tab, nueva) {
			//if (key != null) c = $scope.reports[key];
			var state = {};
			if ($scope.selectedHours) state.hours = JSON.parse(JSON.stringify($scope.selectedHours));
			if ($scope.preFilterData) state.preFilterData = JSON.parse(JSON.stringify($scope.preFilterData));
			if ($scope.publisherGroup) state.publisherGroup = JSON.parse(JSON.stringify($scope.publisherGroup));
			if ($scope.websiteGroup) state.websiteGroup = JSON.parse(JSON.stringify($scope.websiteGroup));
			if ($scope.sectionsGroup) state.sectionsGroup = JSON.parse(JSON.stringify($scope.sectionsGroup));
			if ($scope.liGroup) state.liGroup = JSON.parse(JSON.stringify($scope.liGroup));
			if ($scope.channelGroup) state.channelGroup = JSON.parse(JSON.stringify($scope.channelGroup));
			if ($scope.countryGroup) state.countryGroup = JSON.parse(JSON.stringify($scope.countryGroup));
			if ($scope.sizeGroup) state.sizeGroup = JSON.parse(JSON.stringify($scope.sizeGroup));
			if ($scope.creativeGroup) state.creativeGroup = JSON.parse(JSON.stringify($scope.creativeGroup));
			if ($scope.hashGroup) state.hashGroup = JSON.parse(JSON.stringify($scope.hashGroup));
			if ($scope.advertiserGroup) state.advertiserGroup = JSON.parse(JSON.stringify($scope.advertiserGroup));
			if ($scope.tryGroup) state.tryGroup = JSON.parse(JSON.stringify($scope.tryGroup));
			if ($scope.deviceGroup) state.deviceGroup = JSON.parse(JSON.stringify($scope.deviceGroup));
			if ($scope.platformGroup) state.platformGroup = JSON.parse(JSON.stringify($scope.platformGroup));
			if ($scope.browserGroup) state.browserGroup = JSON.parse(JSON.stringify($scope.browserGroup));
			if ($scope.carrierGroup) state.carrierGroup = JSON.parse(JSON.stringify($scope.carrierGroup));
			if ($scope.versionGroup) state.versionGroup = JSON.parse(JSON.stringify($scope.versionGroup));
			if ($scope.managerGroup) state.managerGroup = JSON.parse(JSON.stringify($scope.managerGroup));
			if ($scope.offersGroup) state.offersGroup = JSON.parse(JSON.stringify($scope.offersGroup));
			if ($scope.connectionGroup) state.connectionGroup = JSON.parse(JSON.stringify($scope.connectionGroup));
			if ($scope.advManagerGroup) state.advManagerGroup = JSON.parse(JSON.stringify($scope.advManagerGroup));
			if ($scope.publisherFilter) state.publisherFilter = JSON.parse(JSON.stringify($scope.publisherFilter));
			if ($scope.selecteds.websiteFilter) state.websiteFilter = JSON.parse(JSON.stringify($scope.selecteds.websiteFilter));
			if ($scope.selecteds.sectionsFilter) state.sectionsFilter = JSON.parse(JSON.stringify($scope.selecteds.sectionsFilter));
			if ($scope.liFilter) state.liFilter = JSON.parse(JSON.stringify($scope.liFilter));
			if ($scope.selecteds.channelFilter) state.channelFilter = JSON.parse(JSON.stringify($scope.selecteds.channelFilter));
			if ($scope.selecteds.countryFilter) state.countryFilter = JSON.parse(JSON.stringify($scope.selecteds.countryFilter));
			if ($scope.selecteds.sizeFilter) state.sizeFilter = JSON.parse(JSON.stringify($scope.selecteds.sizeFilter));
			if ($scope.selecteds.creativeFilter) state.creativeFilter = JSON.parse(JSON.stringify($scope.selecteds.creativeFilter));
			if ($scope.selecteds.advertiserFilter) state.advertiserFilter = JSON.parse(JSON.stringify($scope.selecteds.advertiserFilter));
			if ($scope.selecteds.tryFilter) state.tryFilter = JSON.parse(JSON.stringify($scope.selecteds.tryFilter));
			if ($scope.selecteds.deviceFilter) state.deviceFilter = JSON.parse(JSON.stringify($scope.selecteds.deviceFilter));
			if ($scope.selecteds.platformFilter) state.platformFilter = JSON.parse(JSON.stringify($scope.selecteds.platformFilter));
			if ($scope.selecteds.browserFilter) state.browserFilter = JSON.parse(JSON.stringify($scope.selecteds.browserFilter));
			if ($scope.selecteds.carrierFilter) state.carrierFilter = JSON.parse(JSON.stringify($scope.selecteds.carrierFilter));
			if ($scope.selecteds.versionFilter) state.versionFilter = JSON.parse(JSON.stringify($scope.selecteds.versionFilter));
			if ($scope.selecteds.managerFilter) state.managerFilter = JSON.parse(JSON.stringify($scope.selecteds.managerFilter));
			if ($scope.selecteds.offersFilter) state.offersFilter = JSON.parse(JSON.stringify($scope.selecteds.offersFilter));
			if ($scope.selecteds.advManagerFilter) state.advManagerFilter = JSON.parse(JSON.stringify($scope.selecteds.advManagerFilter));
			if ($scope.selecteds.connectionFilter) state.connectionFilter = JSON.parse(JSON.stringify($scope.selecteds.connectionFilter));
			//if ($scope.range) state.range = JSON.parse(JSON.stringify($scope.range));
			if ($scope.hourInterval) state.hourInterval = JSON.parse(JSON.stringify($scope.hourInterval));
			if ($scope.dayInterval) state.dayInterval = JSON.parse(JSON.stringify($scope.dayInterval));
			if ($scope.monthInterval) state.monthInterval = JSON.parse(JSON.stringify($scope.monthInterval));
			if ($scope.yearInterval) state.yearInterval = JSON.parse(JSON.stringify($scope.yearInterval));
			if ($scope.weekdayInterval) state.weekdayInterval = JSON.parse(JSON.stringify($scope.weekdayInterval));
			if ($scope.dateValue1) state.dateValue1 = JSON.parse(JSON.stringify($scope.dateValue1));
			if ($scope.dateValue2) state.dateValue2 = JSON.parse(JSON.stringify($scope.dateValue2));
			if ($scope.numFilters) state.numFilters = JSON.parse(JSON.stringify($scope.numFilters));
			if ($scope.timezone) state.timezone = JSON.parse(JSON.stringify($scope.timezone));
			if (c) c.filters = state;
			if (tab || tab==0) {
				$scope.tabs[tab].filters = state;
				if (nueva) {
					loadBlank();
				}
			}else{
				if (key == null) {
					//$scope.reports.push(c);
					cardService.newCard(c);
				}else{
					//c.update = true;
					c.oldCard = $scope.reports[key].number;
					console.log(c);
					cardService.newCard(c);
					$scope.removeCard(null, key);
				}
				/*if (!$scope.tabs[$scope.selectedTab].filterTab)
					$scope.tabs[$scope.selectedTab].card = c;*/
			}
		}

		var loadFilters = function (c, callback) {
			var state = c.filters;
			if (state.hours)
				$scope.selectedHours = state.hours;
			else {
				for (var i = 0; i < 24; i++) {
					$scope.selectedHours[i] = false;
				}
			}
			$scope.preFilterData = state.preFilterData;
			$scope.publisherGroup = state.publisherGroup;
			$scope.websiteGroup = state.websiteGroup;
			$scope.sectionsGroup = state.sectionsGroup;
			$scope.liGroup = state.liGroup;
			$scope.channelGroup = state.channelGroup;
			$scope.countryGroup = state.countryGroup;
			$scope.sizeGroup = state.sizeGroup;
			$scope.creativeGroup = state.creativeGroup;
			$scope.hashGroup = state.hashGroup;
			$scope.advertiserGroup = state.advertiserGroup;
			$scope.tryGroup = state.tryGroup;
			$scope.deviceGroup = state.deviceGroup;
			$scope.platformGroup = state.platformGroup;
			$scope.browserGroup = state.browserGroup;
			$scope.carrierGroup = state.carrierGroup;
			$scope.versionGroup = state.versionGroup;
			$scope.managerGroup = state.managerGroup;
			$scope.offerGroup = state.offerGroup;
			$scope.connectionGroup = state.connectionGroup;
			$scope.advManagerGroup = state.advManagerGroup;
			$scope.publisherFilter = state.publisherFilter;
			$scope.selecteds.websiteFilter = state.websiteFilter;
			$scope.selecteds.sectionsFilter = state.sectionsFilter;
			$scope.liFilter = state.liFilter;
			$scope.selecteds.channelFilter = state.channelFilter;
			$scope.selecteds.countryFilter = state.countryFilter;
			$scope.selecteds.sizeFilter = state.sizeFilter;
			$scope.selecteds.creativeFilter = state.creativeFilter;
			$scope.selecteds.advertiserFilter = state.advertiserFilter;
			$scope.selecteds.tryFilter = state.tryFilter;
			$scope.selecteds.deviceFilter = state.deviceFilter;
			$scope.selecteds.platformFilter = state.platformFilter;
			$scope.selecteds.browserFilter = state.browserFilter;
			$scope.selecteds.carrierFilter = state.carrierFilter;
			$scope.selecteds.versionFilter = state.versionFilter;
			$scope.selecteds.managerFilter = state.managerFilter;
			$scope.selecteds.advManagerFilter = state.advManagerFilter;
			$scope.selecteds.offersFilter = state.offersFilter;
			$scope.selecteds.connectionFilter = state.connectionFilter;
			//$scope.range = state.range;
			$scope.hourInterval = state.hourInterval;
			$scope.dayInterval = state.dayInterval;
			$scope.monthInterval = state.monthInterval;
			$scope.yearInterval = state.yearInterval;
			$scope.weekdayInterval = state.weekdayInterval;
			$scope.dateValue1 = new Date(state.dateValue1);
			$scope.dateValue2 = new Date(state.dateValue2);
			$scope.numFilters = state.numFilters;
			$scope.timezone = state.timezone;
			if (callback) {
				callback();
			};
		}

		$scope.resetFilters = function () {
			loadBlank();
		}

		var loadBlank = function () {
			for (var i = 0; i < 24; i++) {
				$scope.selectedHours[i] = false;
			}
			$scope.publisherGroup = false;
			$scope.websiteGroup = false;
			$scope.sectionsGroup = false;
			$scope.liGroup = false;
			$scope.channelGroup = false;
			$scope.countryGroup = false;
			$scope.sizeGroup = false;
			$scope.creativeGroup = false;
			$scope.hashGroup = false;
			$scope.advertiserGroup = false;
			$scope.tryGroup = false;
			$scope.deviceGroup = false;
			$scope.platformGroup = false;
			$scope.browserGroup = false;
			$scope.carrierGroup = false;
			$scope.versionGroup = false;
			$scope.managerGroup = false;
			$scope.advManagerGroup = false;
			$scope.offerGroup = false;
			$scope.connectionGroup = false;
			$scope.publisherFilter = [];
			$scope.selecteds.websiteFilter = [];
			$scope.selecteds.sectionsFilter = [];
			$scope.liFilter = [];
			$scope.selecteds.channelFilter = [];
			$scope.selecteds.countryFilter = [];
			$scope.selecteds.sizeFilter = [];
			$scope.selecteds.creativeFilter = [];
			$scope.selecteds.advertiserFilter = [];
			$scope.selecteds.tryFilter = [];
			$scope.selecteds.deviceFilter = [];
			$scope.selecteds.platformFilter = [];
			$scope.selecteds.browserFilter = [];
			$scope.selecteds.carrierFilter = [];
			$scope.selecteds.versionFilter = [];
			$scope.selecteds.managerFilter = [];
			$scope.selecteds.offersFilter = [];
			$scope.selecteds.hashFilter = [];
			$scope.selecteds.advManagerFilter = [];
			$scope.selecteds.connectionFilter = [];
			//$scope.range = 'none';
			$scope.hourInterval = false;
			$scope.dayInterval = false;
			$scope.monthInterval = false;
			$scope.yearInterval = false;
			$scope.weekdayInterval = false;
			$scope.dateValue1 = new Date();
			$scope.dateValue2 = new Date();
			$scope.numFilters = [];
			$scope.timezone = $scope.timezones[25];
		}

		$scope.regenerate = function (card) {
			//console.log(card);
			/*loadFilters(card, function () {
				$scope.generateReport1(false, true, card);
			});*/
			db.deleteTable(card.number);
			socketio.getReport(card.number);
			checkdb = true;
		}
		$scope.loadNoCards = false;

		$scope.generateReport1 = function (newRep, regenerate, card) {
			if ($scope.socketConnected) {
				$scope.generateReport(newRep, regenerate, card);
			}else{
				localservice.toast('No connection to the server');
			}
		}

		$scope.generateReport = function (newRep, regenerate, card) {
			$scope.gettingReport = true;
			var key = null;
			if (($scope.selectedTab && !newRep && !$scope.tabs[$scope.selectedTab].filterTab) || (regenerate)) {
				var k;
				if (regenerate) {
					k = card;
				}
				else
					k = $scope.tabs[$scope.selectedTab].card;
				for (var i = 0; i < $scope.reports.length; i++) {
					if ($scope.reports[i].number == k.number) {
						key = i;
						break;
					}
				};
				try {
					db.deleteTable($scope.reports[key].number);
				}
				catch(err) {
					console.log('no hay tabla');
				}
			}
			if ($scope.dateValue1 && $scope.dateValue2) {
				var data = {};
				var groups = [];
				var filters = {};
				var nFilters = [];
				for (var i = 0; i < $scope.numFilters.length; i++) {
					nFilters.push($scope.numFilters[i].col+$scope.numFilters[i].operator+$scope.numFilters[i].value);
				}
				//console.log(nFilters);
				if ($scope.managerGroup)
					groups.push('manager');
				if ($scope.publisherGroup)
					groups.push('publisher');
				if ($scope.websiteGroup)
					groups.push('site');
				if ($scope.sectionsGroup)
					groups.push('section');
				if ($scope.offerGroup)
					groups.push('offer');
				if ($scope.liGroup)
					groups.push('li');
				if ($scope.channelGroup)
					groups.push('channel');
				if ($scope.countryGroup)
					groups.push('country');
				if ($scope.sizeGroup)
					groups.push('size');
				if ($scope.creativeGroup)
					groups.push('creative');
				if ($scope.hashGroup)
					groups.push('hash');
				if ($scope.advManagerGroup)
					groups.push('advmanager');
				if ($scope.advertiserGroup)
					groups.push('advertiser');
				if ($scope.tryGroup)
					groups.push('tries');
				if ($scope.deviceGroup)
					groups.push('disp');
				if ($scope.platformGroup)
					groups.push('platform');
				if ($scope.browserGroup)
					groups.push('nav');
				if ($scope.carrierGroup)
					groups.push('carrier');
				if ($scope.versionGroup)
					groups.push('rank');
				if ($scope.connectionGroup)
					groups.push('connection');
				//filtro publishers
				if ($scope.publisherFilter.length) {
					var pubs = [];
					for (var i = 0; i < $scope.publisherFilter.length; i++) {
						pubs.push($scope.publisherFilter[i].userId);
					};
					if ($scope.notPublisher)
						filters['!publisher'] = pubs;
					else
						filters.publisher = pubs;
				}
				//filtro websites
				if ($scope.selecteds.websiteFilter.length) {
					if (!$scope.publisherFilter.length) {
						var pubs = [];
						for (var i = 0; i < $scope.selecteds.websiteFilter.length; i++) {
							pubs.push($scope.selecteds.websiteFilter[i].webId);
						};
						if ($scope.notWebsite)
							filters['!site'] = pubs;
						else
							filters.site = pubs;
					}else{
						if ($scope.notWebsite)
							filters['!site'] = pubs;
						else
							filters.site = $scope.selecteds.websiteFilter;
					}
				}
				//filtro sections
				if ($scope.selecteds.sectionsFilter.length) {
					filters.section = $scope.selecteds.sectionsFilter;
				}
				//filtro offers
				if ($scope.selecteds.offersFilter.length) {
					var offer = [];
					for (var i = 0; i < $scope.selecteds.offersFilter.length; i++) {
						offer.push($scope.selecteds.offersFilter[i].offerId);
					};
					if ($scope.notOffer)
						filters['!offer'] = offer;
					else
						filters.offer = offer;
				}
				//filtro li
				if ($scope.liFilter.length) {
					var li = [];
					for (var i = 0; i < $scope.liFilter.length; i++) {
						li.push($scope.liFilter[i].liId);
					};
					if ($scope.notLi)
						filters['!li'] = li;
					else
						filters.li = li;
				}
				//otros filtros
				if ($scope.selecteds.managerFilter) {
					if ($scope.notManager)
						filters['!manager'] = $scope.selecteds.managerFilter;
					else
						filters.manager = $scope.selecteds.managerFilter;
				}
				if ($scope.selecteds.channelFilter)
					if ($scope.notChannel)
						filters['!channel'] = $scope.selecteds.channelFilter;
					else
						filters.channel = $scope.selecteds.channelFilter;
				if ($scope.selecteds.countryFilter)
					if ($scope.notCountry)
						filters['!country'] = $scope.selecteds.countryFilter;
					else
						filters.country = $scope.selecteds.countryFilter;
				if ($scope.selecteds.sizeFilter)
					if ($scope.notCountry)
						filters['!size'] = $scope.selecteds.sizeFilter;
					else
						filters.size = $scope.selecteds.sizeFilter;
				if ($scope.selecteds.creativeFilter.lenght)
					if ($scope.notCreative)
						filters['!creative'] = $scope.selecteds.creativeFilter;
					else
						filters.creative = $scope.selecteds.creativeFilter;
				if ($scope.selecteds.advManagerFilter) {
					if ($scope.notAdvManager)
						filters['!advmanager'] = $scope.selecteds.advManagerFilter;
					else
						filters.advmanager = $scope.selecteds.advManagerFilter;
				}
				if ($scope.selecteds.advertiserFilter)
					if ($scope.notAdvertiser)
						filters['!advertiser'] = $scope.selecteds.advertiserFilter;
					else
						filters.advertiser = $scope.selecteds.advertiserFilter;
				if ($scope.selecteds.tryFilter)
					if ($scope.notTries)
						filters['!tries'] = $scope.selecteds.tryFilter;
					else
						filters.tries = $scope.selecteds.tryFilter;
				if ($scope.selecteds.deviceFilter)
					if ($scope.notDevice)
						filters['!disp'] = $scope.selecteds.deviceFilter;
					else
						filters.disp = $scope.selecteds.deviceFilter;
				if ($scope.selecteds.platformFilter)
					if ($scope.notPlatform)
						filters['!platform'] = $scope.selecteds.platformFilter;
					else
						filters.platform = $scope.selecteds.platformFilter;
				if ($scope.selecteds.browserFilter)
					if ($scope.notBrowser)
						filters['!nav'] = $scope.selecteds.browserFilter;
					else
						filters.nav = $scope.selecteds.browserFilter;
				if ($scope.selecteds.carrierFilter)
					if ($scope.notCarrier)
						filters['!carrier'] = $scope.selecteds.carrierFilter;
					else
						filters.carrier = $scope.selecteds.carrierFilter;
				if ($scope.selecteds.versionFilter)
					if ($scope.notVersion)
						filters['!rank'] = $scope.selecteds.versionFilter;
					else
						filters.rank = $scope.selecteds.versionFilter;
				if ($scope.selecteds.connectionFilter)
					if ($scope.notConnection)
						filters['!connection'] = $scope.selecteds.connectionFilter;
					else
						filters.connection = $scope.selecteds.connectionFilter;
				var hours = [];
				for (var i = 0; i < $scope.selectedHours.length; i++) {
					if ($scope.selectedHours[i]) hours.push(i);
				};
				if (hours.length) filters.hour = hours;
				var noColumns = {};
				for (var i = 0; i < $scope.preFilterData.length; i++) {
					noColumns[$scope.preFilterData[i].name] = $scope.preFilterData[i].status;
				};
				localStorage.columns = JSON.stringify($scope.preFilterData);
				data.groups = groups;
				data.filters = filters;
				data.from = $scope.dateValue1;
				data.to = $scope.dateValue2;
				data.nFilters = nFilters;
				var interval = '';
				if ($scope.hourInterval) {
					data.groups.push('hour');
					interval += 'hour ';
				}
				data.range = '';
				if ($scope.dayInterval) {
					data.range += 'day';
					interval += 'day ';
				}
				if ($scope.weekdayInterval) {
					if (data.range.length)
						data.range += ' ';
					data.range += 'wday';
					interval += 'wday ';
				}
				if ($scope.monthInterval) {
					if (data.range.length)
						data.range += ' ';
					data.range += 'month';
					interval += 'month ';
				}
				if ($scope.yearInterval) {
					if (data.range.length)
						data.range += ' ';
					data.range += 'year';
					interval += 'year ';
				}
				if (data.range == '')
					data.range = 'none';
				if (interval == '')
					interval = 'none';
				data.timezone = $scope.timezone.value;
				if (key!=null)
					socketio.generateReport(data, key, noColumns);
				else
					socketio.generateReport(data, $scope.reports.length, noColumns);
				if (regenerate) {
					if ($scope.tabs[$scope.selectedTab].filters)
						loadFilters($scope.tabs[$scope.selectedTab]);
					else
						loadBlank();
				}
				var resumen = '';
				for (var i = 0; i < data.groups.length; i++) {
					if (resumen.length)
						resumen += '-'+data.groups[i];
					else
						resumen = data.groups[i];
				}
				console.log(data.filters);
				for (p in data.filters) {
					if (!(p.indexOf(resumen) > -1)) {
						if (resumen.length)
							resumen += '-'+p;
						else
							resumen = p;
					}
				}
				var nReport = {
					number: '',
					timestamp: new Date(),
					reportName: 'Report '+($scope.reports.length+1),
					state: 'Connecting',
					timestamp: new Date().getTime(),
					menuOpen: false,
					autoOpen: $scope.openWhenReady,
					filterDesc: resumen,
					creator: $scope.user.userEmail,
					interval: interval
				}
				if ($scope.openWhenReady) {
					$scope.openWhenReady = false;
				}
				saveCard(nReport, key);
			}
		}

		$scope.$on('update', function (event, r) {
			console.log('entraaa');
			var i;
			for (i = 0; i < $scope.reports.length; i++) {
				if ($scope.reports[i].number == r.number)
					break;
			}
			if (r.id) $scope.reports[i].number = r.id;
			if (r.state) $scope.reports[i].state = r.state;
			if (r.msg) $scope.reports[i].msg = r.msg;
			if (r.dwn === true) $scope.reports[i].dwn = r.dwn = true;
			if (r.dwn === false) $scope.reports[i].dwn = r.dwn = false;
			//if (!r.noApply) $scope.$apply();
			//db.putCard($scope.reports[i]);
			if (r.state === 'Ready' && $scope.reports[i].autoOpen && !$scope.reports[i].oldCard) {
				$scope.openNewTab($scope.reports[i]);
				$scope.openWhenReady = true;
			}
			if ($scope.reports[i].oldCard && r.state === 'Ready') {
				//$scope.tabs[$scope.selectedTab].card = $scope.reports[r.number];
				//$scope.selectTab($scope.selectedTab);
				for (var j = 0; j < $scope.tabs.length; j++) {
					if (!$scope.tabs[j].filterTab) {
						if ($scope.tabs[j].card.number == $scope.reports[i].oldCard) {
							$scope.tabs[j].card = $scope.reports[i];
							if (j == $scope.selectedTab)
								$scope.selectTab(j);
						}
					}
				};
			}
			if(!$scope.$$phase) {
			 	$scope.$apply();
			}
	    });

		$scope.$on('savedOk', function (event, r) {
			$scope.downloadeds[r] = true;
			console.log(JSON.stringify($scope.downloadeds));
		});

	    $scope.removeCard = function (ev, key) {
	    	/*var confirm = $mdDialog.confirm()
	    	  .parent(angular.element(document.body))
	    	  .title('Esta seguro?')
	    	  .content('Se eliminará localmente el reporte')
	    	  .ariaLabel('Lucky day')
	    	  .ok('Si')
	    	  .cancel('No')
	    	  .targetEvent(ev);
	    	$mdDialog.show(confirm).then(function() {*/
	    		try {
	    			db.deleteTable($scope.reports[key].number);
	    		}
	    		catch(err) {
	    			console.log('no hay tabla');
	    		}
	    	  	//db.deleteCard($scope.reports[key].timestamp);
	    	  	cardService.deleteCard($scope.reports[key].number);
	    	  	$scope.reports.splice(key, 1);
	    	/*}, function() {});*/
	    }

	    $scope.openNewTab = function (card) {
	    	if (card.state == 'Ready')
	    		$scope.addTab(card);
	    	if (card.state == 'Ready for download')
	    		socketio.getReport(card.number);
	    }

		var toast = function (msg) {
			localservice.toast(msg);
		}

		$scope.tableData = null;

		$scope.changeNameModal = function (k, $event) {
			$mdDialog.show({
				controller: 'cardNameController',
				templateUrl: 'templates/change_card_name.html?v='+versionPanel,
				targetEvent: $event,
				locals: {
			    	oldName: $scope.reports[k].reportName
			    }
			})
			.then(function(newName) {
				if (newName!=true) {
					//$scope.reports[k].reportName = newName;
					localservice.broadcast('updateName', {idReport: $scope.reports[k].number, name: newName});
					//db.putCard($scope.reports[k]);
				}
			}, function() {
			});
		}

		$scope.settings = function ($event) {
			$mdDialog.show({
				controller: 'reportSettingsController',
				templateUrl: 'templates/report_settings.html?v='+versionPanel,
				targetEvent: $event
			})
			.then(function() {
			}, function() {
			});
		}

		$scope.$on('gridApi', function (event, newState) {
			$scope.gridApi = newState;
	    });

	    $scope.openMenu = function (k, ev) {
	    	$scope.menuLeft = ev.clientX;
	    	$scope.menuTop = ev.clientY-128-(153*k);
	    	if (!$scope.reports[k].menuOpen) {
	    		console.log('entra');
	    		if ($scope.reports[k].menuOpen == true) {
	    			$scope.reports[k].menuOpen = false;
	    		}else{
	    			for (var i = 0; i < $scope.reports.length; i++) {
	    				$scope.reports[i].menuOpen = false;
	    			}
	    			$scope.reports[k].menuOpen = true;
	    		}
	    	}

	    }

	    $scope.closeMenu = function (k) {
	    	for (var i = 0; i < $scope.reports.length; i++) {
	    		$scope.reports[i].menuOpen = false;
	    	};
	    }

	    $scope.toggleSubMenu = function (k) {
	    	$scope.reports[k].subOpen = !$scope.reports[k].subOpen;
	    }

	    $scope.deleteToken = function () {
	    	webservice.setToken('lalala');
	    }

	    $scope.negateFilter = function (f) {
	    	$scope['not'+f] = !$scope['not'+f];
	    }

	    $scope.numFilters = [];

	    $scope.addNFilter = function () {
	    	if ($scope.newCol && $scope.newOperator && $scope.newValue) {
	    		$scope.numFilters.push({col: $scope.newCol, operator: $scope.newOperator, value: $scope.newValue});
	    		$scope.newCol = '';
	    		$scope.newOperator = '';
	    		$scope.newValue = '';
	    	}
	    }

	    $scope.removeNFilter = function (k) {
	    	$scope.numFilters.splice(k, 1);
	    }

	    $scope.$on('socketConnect', function (event, data) {
	    	$scope.socketConnected = true;
	    });

	    $scope.$on('socketDisconnect', function (event, data) {
	    	$scope.socketConnected = false;
	    });

        $scope.modalFilter = function (e, dataset) {
        	var col = {};
        	col[dataset] = $scope[dataset];
        	$mdDialog.show({
        		controller: 'modalFilterCtrl',
        		templateUrl: 'templates/modals/filter.html?v='+versionPanel,
        		targetEvent: e,
        		locals: {
    		    	col: col
    		    }
        	})
        	.then(function(sel) {
        		switch (dataset) {
        			case 'publishers':
        				if (sel.length)
        					$scope.publisherFilter = $scope.publisherFilter.concat(sel);
        				break;
        			case 'websites':
        				if (sel.length)
        					$scope.selecteds.websiteFilter = $scope.selecteds.websiteFilter.concat(sel);
        				break;
        			case 'offers':
        				if (sel.length)
        					$scope.selecteds.offersFilter = $scope.selecteds.offersFilter.concat(sel);
        				break;
        			case 'lineitem':
        				if (sel.length)
        					$scope.liFilter = $scope.liFilter.concat(sel);
        				break;
        			case 'section':
        				if (!$scope.selecteds.sectionsFilter)
        					$scope.selecteds.sectionsFilter = [];
        				for (var i = 0; i < sel.length; i++) {
        					$scope.selecteds.sectionsFilter.push(sel[i].adsId);
        				};
        				break;
        			case 'channels':
        				if (!$scope.selecteds.channelFilter)
        					$scope.selecteds.channelFilter = [];
        				for (var i = sel.length - 1; i >= 0; i--) {
        					$scope.selecteds.channelFilter.push(sel[i].chaId);
        					setTimeout(function () {
		        				$('.filter-chosen').trigger('chosen:updated');
		        			});
        				};
        				break;
        			case 'countries':
        				if (!$scope.selecteds.countryFilter)
        					$scope.selecteds.countryFilter = [];
        				for (var i = sel.length - 1; i >= 0; i--) {
        					$scope.selecteds.countryFilter.push(sel[i].countryCode);
        					setTimeout(function () {
		        				$('.filter-chosen').trigger('chosen:updated');
		        			});
        				};
        				break;
        			case 'sizes':
    					if (!$scope.selecteds.sizeFilter)
    						$scope.selecteds.sizeFilter = [];
        				for (var i = sel.length - 1; i >= 0; i--) {
        					$scope.selecteds.sizeFilter.push(sel[i].sizeId);
        					setTimeout(function () {
		        				$('.filter-chosen').trigger('chosen:updated');
		        			});
        				};
        				break;
        			case 'hashes':
        				if (!$scope.selecteds.hashFilter)
        					$scope.selecteds.hashFilter = [];
        				for (var i = sel.length - 1; i >= 0; i--) {
        					$scope.selecteds.hashFilter.push(sel[i].hashId);
        					setTimeout(function () {
		        				$('.filter-chosen').trigger('chosen:updated');
		        			});
        				}
        				break;
        			case 'advertisers':
        				if (!$scope.selecteds.advertiserFilter)
        					$scope.selecteds.advertiserFilter = [];
        				for (var i = sel.length - 1; i >= 0; i--) {
        					$scope.selecteds.advertiserFilter.push(sel[i].advId);
        					setTimeout(function () {
		        				$('.filter-chosen').trigger('chosen:updated');
		        			});
        				}
        				break;
        			case 'tries':
        				if (!$scope.selecteds.tryFilter)
        					$scope.selecteds.tryFilter = [];
        				for (var i = sel.length - 1; i >= 0; i--) {
        					$scope.selecteds.tryFilter.push(sel[i].trieId);
        					setTimeout(function () {
		        				$('.filter-chosen').trigger('chosen:updated');
		        			});
        				}
        				break;
        			case 'devices':
        				if (!$scope.selecteds.deviceFilter)
        					$scope.selecteds.deviceFilter = [];
        				for (var i = sel.length - 1; i >= 0; i--) {
        					$scope.selecteds.deviceFilter.push(sel[i].deviceAlias);
        					setTimeout(function () {
		        				$('.filter-chosen').trigger('chosen:updated');
		        			});
        				}
        				break;
        			case 'platforms':
        				if (!$scope.selecteds.platformFilter)
        					$scope.selecteds.platformFilter = [];
        				for (var i = sel.length - 1; i >= 0; i--) {
        					$scope.selecteds.platformFilter.push(sel[i].platformId);
        					setTimeout(function () {
		        				$('.filter-chosen').trigger('chosen:updated');
		        			});
        				}
        				break;
        			case 'browsers':
        				if (!$scope.selecteds.browserFilter)
        					$scope.selecteds.browserFilter = [];
        				for (var i = sel.length - 1; i >= 0; i--) {
        					$scope.selecteds.browserFilter.push(sel[i].browserId);
        					setTimeout(function () {
		        				$('.filter-chosen').trigger('chosen:updated');
		        			});
        				}
        				break;
        			case 'carriers':
        				if (!$scope.selecteds.carrierFilter)
        					$scope.selecteds.carrierFilter = [];
        				for (var i = sel.length - 1; i >= 0; i--) {
        					$scope.selecteds.carrierFilter.push(sel[i].carId);
        					setTimeout(function () {
		        				$('.filter-chosen').trigger('chosen:updated');
		        			});
        				}
        				break;
        			case 'versions':
        				if (!$scope.selecteds.versionFilter)
        					$scope.selecteds.versionFilter = [];
        				for (var i = sel.length - 1; i >= 0; i--) {
        					$scope.selecteds.versionFilter.push(sel[i].rtId);
        					setTimeout(function () {
		        				$('.filter-chosen').trigger('chosen:updated');
		        			});
        				}
        				break;
        			case 'accountManagers':
        				if (!$scope.selecteds.managerFilter)
        					$scope.selecteds.managerFilter = [];
        				for (var i = sel.length - 1; i >= 0; i--) {
        					$scope.selecteds.managerFilter.push(sel[i].amId);
        					setTimeout(function () {
		        				$('.filter-chosen').trigger('chosen:updated');
		        			});
        				}
        				break;
        			case 'advManagers':
        				if (!$scope.selecteds.advManagerFilter)
        					$scope.selecteds.advManagerFilter = [];
        				for (var i = sel.length - 1; i >= 0; i--) {
        					$scope.selecteds.advManagerFilter.push(sel[i].acaId);
        					setTimeout(function () {
		        				$('.filter-chosen').trigger('chosen:updated');
		        			});
        				}
        				break;
        		}
        	}, function() {
        	});
        }

	    $scope.getUserName = function (id) {
	    	if ($scope.publishers) {
	    		for (var i = 0; i < $scope.publishers.length; i++) {
	    			if ($scope.publishers[i].userId == id)
	    				return $scope.publishers[i].userEmail;
	    		}
	    		return id;
	    	}else{
	    		return id;
	    	}
	    }

	    $scope.getReport = function () {
	    	cardService.stopCache();
	    	socketio.getReport($scope.searchId);
	    	$scope.searchId = '';
	    }

	    $scope.hideToolbar = function () {
	    	localservice.broadcast('mobileHide', null);
	    }

	    $scope.orders = {
	    Manager: 1,
	    Publisher: 3,
	    Website: 5,
	    Section: 7,
	    Offer: 9,
	    Line: 11,
	    Channel: 13,
	    Country: 15,
	    Size: 17,
	    Creative: 19,
	    Hash: 2,
	    Adv: 4,
	    Advertiser: 6,
	    Tries: 8,
	    Device: 10,
	    Platform: 12,
	    Browser: 14,
	    Carrier: 16,
	    Rank: 18,
		Connection: 20}

	});

	ctrl.controller('modalFilterCtrl', ['$scope', '$mdDialog', 'col', 'webservice', function ($scope, $mdDialog, col, webservice) {

		$scope.input = '';
		$scope.selecteds = [];
		var colName = '';
		for (k in col) {
			colName = k;
			$scope.name = k.toUpperCase();
		}
		var collection = col[colName];

		$scope.search = function () {
			$scope.filteredCollection = [];
			var filter = $scope.input;
			var resumen = '';
			var resumenOculto = '';
			if(collection == undefined){
				switch(colName) {
					case 'lineitem':
						$scope.isLoading = true;
						webservice.get('/lineItemName?name='+filter, function (data) {
							$scope.isLoading = false;
							var lineItems = data;
							for(var j = 0; j < lineItems.length; j++) {
								resumen = lineItems[j].liId+ '-' + lineItems[j].liName;
								lineItems[j].resumen = resumen;
								$scope.filteredCollection.push(lineItems[j]);
							}
						})
						break;
					case 'section':
						var type = "ads";
						$scope.isLoading = true;
						webservice.get('/search?param='+filter+'&type='+ type, function (data) {
							$scope.isLoading = false;
							var sections = data;
							for(var j = 0; j < sections.length; j++) {
								resumen = sections[j].adsId+ '-' + sections[j].adsName;
								sections[j].resumen = resumen;
								$scope.filteredCollection.push(sections[j]);
							}
						})
						break;
				}
			} else {
				for (var i = 0; i < collection.length; i++) {
					switch (colName) {
						case 'publishers':
							resumen = collection[i].userId+' - '+collection[i].userEmail+' '+collection[i].userName+' '+collection[i].userLastName;
							resumenOculto = resumen;
							for (var j = 0; j < collection[i].userWebsiteData.length; j++) {
								resumenOculto += ' '+collection[i].userWebsiteData[j].webUrl;
							};
							break;
						case 'websites':
							resumen = collection[i].webId+' - '+collection[i].webUrl+' - '+collection[i].webUserData.userEmail;
							resumenOculto = collection[i].webId+' - '+collection[i].webUrl+' - '+collection[i].webUserData.userEmail;
							break;
						case 'offers':
							resumen = collection[i].offerId+' - '+collection[i].offerName;
							resumenOculto = resumen;
							break;
						case 'channels':
							resumen = collection[i].chaId + ' - ' + collection[i].chaName;
							resumenOculto = collection[i].chaId + ' - ' + collection[i].chaName;
							break;
						case 'countries':
							resumen = collection[i].countryId + ' - ' + collection[i].countryName;
							resumenOculto = collection[i].countryId + ' - ' + collection[i].countryName;
							break;
						case 'sizes':
							resumen = collection[i].sizeId + ' - ' + collection[i].sizeDescription;
							resumenOculto = collection[i].sizeId + ' - ' + collection[i].sizeDescription;
							break;
						case 'hashes':
							resumen = collection[i].hashId + ' - ' +collection[i].hashName;
							resumenOculto = collection[i].hashId + ' - ' +collection[i].hashName; 
							break;
						case 'advertisers':
							resumen = collection[i].advId + '-' + collection[i].advName;
							resumenOculto = collection[i].advId + '-' + collection[i].advName;
							break;
						case 'tries':
							resumen = collection[i].trieId + '-' + collection[i].trieName;
							resumenOculto = collection[i].trieId + '-' + collection[i].trieName;
							break;
						case 'devices':
							resumen = collection[i].deviceId + '-' + collection[i].deviceName;
							resumenOculto = collection[i].deviceId + '-' + collection[i].deviceName;
							break;
						case 'platforms':
							resumen = collection[i].platformId + '-' + collection[i].platformName;
							resumenOculto = collection[i].platformId + ' - ' + collection[i].platformName;
							break;
						case 'browsers':
							resumen = collection[i].browserId + '-' + collection[i].browserName;
							resumenOculto = collection[i].browserId + '-' + collection[i].browserName;
							break;
						case 'carriers':
							resumen = collection[i].carId + '-' + collection[i].carName;
							resumenOculto = collection[i].carId + '-' + collection[i].carName;
							break;
						case 'versions':
							resumen = collection[i].rtId + '-' + collection[i].rtName;
							resumenOculto = collection[i].rtId + '-' + collection[i].rtName;
							break;
						case 'accountManagers':
							resumen = collection[i].amId + ' -'  + collection[i].amName + ' '+ collection[i].amLastName + ' - '+collection[i].amEmail;
							resumenOculto = collection[i].amId + ' -'  + collection[i].amName + ' '+ collection[i].amLastName + ' - '+collection[i].amEmail;
							break;
						case 'advManagers':
							resumen = collection[i].acaId + ' -'  + collection[i].acaName;
							resumenOculto = resumen;
							break;
					}

					var res = resumenOculto.toLowerCase();
					var fil = filter.toLowerCase();	
					
					if (res.indexOf(fil) > -1) {
						collection[i].resumen = resumen;
						collection[i].resumenOculto = resumenOculto;
						$scope.filteredCollection.push(collection[i]);
					}
				};
			}
			
		}

		if (collection) {
			if (collection.length < 20)
				$scope.search();
		}

		$scope.toRight = function () {
			if ($scope.left.length) {
				var found = false;
				for (var i = 0; i < $scope.left.length; i++) {
					found = false;
					for (var j = 0; j < $scope.selecteds.length; j++) {
						if ($scope.selecteds[j].resumenOculto == $scope.left[i].resumenOculto) {
							found = true;
							break;
						}
					};
					if (!found) {
						$scope.selecteds.push($scope.left[i]);
					}
				};
			}
				//$scope.selecteds = $scope.selecteds.concat($scope.left);
		}

		$scope.toLeft = function () {
			for (var i = 0; i < $scope.right.length; i++) {
				for (var j = 0; j < $scope.selecteds.length; j++) {
					if ($scope.right[i].resumen == $scope.selecteds[j].resumen) {
						$scope.selecteds.splice(j, 1);
						break;
					}
				}
			}
		}

		$scope.update = function () {
			$mdDialog.hide($scope.selecteds);
		}

		$scope.close = function () {
			$mdDialog.hide();
		}
	}]);

})();