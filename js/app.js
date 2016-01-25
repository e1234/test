(function () {

    var app = angular.module('app', [
        'ngMaterial',
        'ngMdIcons',
        'ngRoute',
        'ui.grid',
        'ui.grid.autoResize',
        'ui.grid.resizeColumns',
        'ui.grid.moveColumns',
        'ui.grid.selection',
        'ui.grid.pagination',
        'ui.grid.grouping',
        'ui.grid.saveState',
        'ui.grid.exporter',
        'angular.chosen',
        'mdDateTime',
        //'ngDraggable',
        'categories',
        'report',
        'publishers',
        'userModal',
        'AppCtrl',
        'CampListCtrl',
        'CpaCtrl',
        'CreateCtrl',
        'HomeCtrl',
        'LoginCtrl',
        'AdministrateCtrl',
        'MenuCtrl',
        'ReferersCtrl',
        'AdvertisersCtrl',
        'CardNameCtrl',
        'ReportSettingsController',
        'FacUser',
        'FacMenu',
        'Idioma',
        'Webservice',
        'Localservice',
        'Db',
        'Socketio',
        'ReportService',
        'offers',
        'cards',
        'UserCtrl',
        'ng.deviceDetector',
        'channels',
        'faq',
        'texts',
        'ngWig',
        'advModal',
        'pathService',
        'timezones'
    ]);

    app.config(function($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            // Allow same origin resource loads.
            'self',
            // Allow loading from our assets domain.  Notice the difference between * and **.
            'http://engine.smartadtags.com/**'
        ]);
    });

    app.config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('cyan');
    });

    app.config(function($mdThemingProvider) {
        // Configure a dark theme with primary foreground yellow
        $mdThemingProvider.theme('docs-dark')
        .primaryPalette('blue')
        .dark();
    });

    app.config(function($mdThemingProvider) {
        // Configure a dark theme with primary foreground yellow
        $mdThemingProvider.theme('notif-color')
        .primaryPalette('blue')
        .backgroundPalette('light-blue')
        .accentPalette('teal');
    });

    app.config(function($mdThemingProvider) {
        // Configure a dark theme with primary foreground yellow
        $mdThemingProvider.theme('notif-color-1')
        .primaryPalette('teal')
        .backgroundPalette('blue-grey')
        .accentPalette('teal');
    });

    app.config(function($mdThemingProvider) {
        // Configure a dark theme with primary foreground yellow
        $mdThemingProvider.theme('fTheme-1')
        .primaryPalette('indigo')
        .backgroundPalette('blue')
        .accentPalette('red');
    });

    app.config(function($mdThemingProvider) {
        // Configure a dark theme with primary foreground yellow
        $mdThemingProvider.theme('yellow')
        .primaryPalette('indigo')
        .backgroundPalette('yellow')
        .accentPalette('red');
    });
/* EJEMPLO BACKGROUND
    app.config(function($mdThemingProvider) {
        // Configure a dark theme with primary foreground yellow
        $mdThemingProvider.theme('indigo-bkg')
        .primaryPalette('cyan')
        .backgroundPalette('indigo', {
                'default': '400'
            })
        .accentPalette('cyan');
        // 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, A100, A200, A400, A700
    });
*/
    app.config(function($mdDateLocaleProvider) {
        $mdDateLocaleProvider.formatDate = function(date) {
            var dd = date.getDate();
            var mm = date.getMonth()+1;
            if (mm<10) mm = '0'+mm;
            var yy = date.getFullYear();
            return dd+'/'+mm+'/'+yy;
        };
        $mdDateLocaleProvider.parseDate = function(dateString) {
            var m = moment(dateString, 'DD/MM/YYYY');
            return m.isValid() ? m.toDate() : new Date(NaN);
        };
    });

    app.config(function($routeProvider){
        $routeProvider
            .when('/home', { controller: 'homeCtrl', templateUrl: 'templates/home.html?v='+versionPanel } )
            .when('/report', { controller: 'reportCtrl', templateUrl: 'templates/report2.html?v='+versionPanel } )
            .when('/create', { controller: 'createCtrl', templateUrl: 'templates/create.html?v='+versionPanel } )
            .when('/administrate', { controller: 'administrateCtrl', templateUrl: 'templates/administrate.html?v='+versionPanel } )
            .when('/campaignlist', { controller: 'campListCtrl', templateUrl: 'templates/campaign_list.html?v='+versionPanel})
            .when('/referers', { controller: 'referersCtrl', templateUrl: 'templates/referers.html?v='+versionPanel})
            .when('/publishers', { controller: 'publishersCtrl', templateUrl: 'templates/publishers.html?v='+versionPanel})
            .when('/cpa', { controller: 'cpaCtrl', templateUrl: 'templates/cpa.html?v='+versionPanel})
            .when('/advertisers', { controller: 'advertisersCtrl', templateUrl: 'templates/advertisers.html?v='+versionPanel})
            .when('/categories', { controller: 'categoriesCtrl', templateUrl: 'templates/categories.html?v='+versionPanel})
            .when('/offers', { controller: 'offersCtrl', templateUrl: 'templates/offers.html?v='+versionPanel})
            .when('/channels', {controller: 'channelsCtrl', templateUrl: 'templates/channels.html?v='+versionPanel})
            .when('/faq', {controller: 'faqCtrl', templateUrl: 'templates/faq.html?v='+versionPanel})
            .when('/mobile_report', {controller: 'mobileReportCtrl', templateUrl: 'templates/mobile_report.html?v='+versionPanel})
            .otherwise( { redirectTo: '/home' } );
    });


    app.directive('selectOnClick', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('click', function () {
                    this.select();
                });
            }
        };
    });

    app.directive('ngRightClick', function($parse) {
        return function(scope, element, attrs) {
            var fn = $parse(attrs.ngRightClick);
            element.bind('contextmenu', function(event) {
                scope.$apply(function() {
                    event.preventDefault();
                    fn(scope, {$event:event});
                });
            });
        };
    });

    app.directive('ngMiddleClick', function($parse) {
        return function(scope, element, attrs) {
            var fn = $parse(attrs.ngMiddleClick);
            element.bind('click', function(event) {
                if (event.button == 1) {
                    scope.$apply(function() {
                        event.preventDefault();
                        fn(scope, {$event:event});
                    });
                }
            });
        };
    });

    app.directive('ngFastClick', function($parse) {
        return function(scope, element, attrs) {
            var fn = $parse(attrs.ngFastClick);
            var flag = false;
            var down = false;

            element.bind('mousedown', function(event) {
                if (event.button === 0) {
                    scope.$apply(function() {
                        //event.preventDefault();
                        down = true;
                        flag = false;
                    });
                }
            });

            element.bind('mousemove', function(event) {
                scope.$apply(function() {
                    //event.preventDefault();
                    if (down)
                        flag = true;
                });
            });

            element.bind('mouseup', function(event) {
                if (event.button === 0) {
                    scope.$apply(function() {
                        //event.preventDefault();
                        if (!flag)
                            fn(scope, {$event:event});
                        flag = false;
                        down = false;
                    });
                }
            });

        };
    });

    app.directive('divheight', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                scope.$watch(function () {
                    scope[attrs.divheight] = element[0].offsetHeight;
                });
            }
        };
     });

    app.directive('divwidth', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                scope.$watch(function () {
                    scope[attrs.divwidth] = element[0].offsetWidth;
                });
            }
        };
     });

    app.directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    });

    app.directive('ngEsc', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 27) {
                    scope.$apply(function (){
                        scope.$eval(attrs.ngEsc);
                    });
                    event.preventDefault();
                }
            });
        };
    });

    app.directive('focusMe', function($timeout) {
      return {
        scope: { trigger: '@focusMe' },
        link: function(scope, element) {
          scope.$watch('trigger', function(value) {
            if(value === "true") {
              $timeout(function() {
                element[0].focus();
              });
            }
          });
        }
      };
    });

    app.directive('ngSidebarHover', function($parse) {
        return function(scope, element, attrs) {
            element.bind('mousemove', function(event) {
                if (event.pageX < 5) {
                    scope.$apply(function() {

                        scope.$eval(attrs.ngSidebarHover);
                    });
                }else{
                    scope.$apply(function() {

                        scope.$eval(attrs.stopHover);
                    });
                }
            });
        };
    });

    app.directive('turboChosen', [function() {
        return {
            templateUrl: 'templates/directives/turbo_chosen.html',
            controllerAs : 'trb',
            bindToController: true,
            scope: {
                collection: '=',
                model: '='
            },
            controller : ['$attrs', '$scope', function ($attrs, $scope) {
                $scope.collection = this.collection;
                console.log($scope.collection);
                $scope.prefilter = '';
                $scope.filtered = [];
                $scope.collection = this.collection;
                $scope.model = this.model;
                $scope.$watch(function () { return $scope.prefilter }, function (filter) {
                    console.log('entra');
                    //$scope.pkey.pubSel = 0;
                    if ($scope.prefilter.length >= 1) {
                        var resumen = '';
                        $scope.filtered = [];
                        for (var i = 0; i < $scope.collection.length; i++) {
                            resumen = $scope.collection[i].resumen;
                            var res = resumen.toLowerCase();
                            var fil = filter.toLowerCase();
                            if (res.indexOf(fil) > -1) {
                                //$scope.publishers[i].resumen = resumen;
                                $scope.filtered.push($scope.collection[i]);
                            }
                        }
                    }else{
                        $scope.filtered = [];
                    }
                });
            }]
        }
    }]);

    app.directive('turboScroll', function () {
        return function (scope, element, attrs) {
            var h;
            element.bind("scroll", function (event) {
                h = element[0].children.length*element[0].children[0].clientHeight;
                if ((h-element[0].scrollTop)<300) {
                    scope.$apply(function () {
                        scope.$eval(attrs.turboScroll);
                    });
                    event.preventDefault();
                }
            });
        };
    });

    app.directive('repeatDone', function() {
        return function(scope, element, attrs) {
            if (scope.$last) {
                scope.$eval(attrs.repeatDone);
            }
        }
    })

})();
