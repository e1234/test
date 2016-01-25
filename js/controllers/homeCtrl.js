( function () {

    var ctrl = angular.module('HomeCtrl',[]);

        ctrl.controller('homeCtrl', function ($scope, webservice, localservice, $mdDialog, $mdSidenav, $window, $location, $timeout) {

            var isPublishers = false;
            localservice.broadcast("isPublishers", isPublishers);
            if($location.path() == "/home") {
                var path = "Home";
                localservice.broadcast("titleReady", path);
            }

            //setTimeout(function () {
            //  $scope.chart = {
            //         chart: {
            //             type: 'area',
            //         },
            //         title: {
            //             text: 'US and USSR nuclear stockpiles'
            //         },
            //         subtitle: {
            //             text: 'Source: <a href="http://thebulletin.metapress.com/content/c4120650912x74k7/fulltext.pdf">' +
            //                 'thebulletin.metapress.com</a>'
            //         },
            //         xAxis: {
            //             allowDecimals: false,
            //             labels: {
            //                 formatter: function () {
            //                     return this.value; // clean, unformatted number for year
            //                 }
            //             }
            //         },
            //         yAxis: {
            //             title: {
            //                 text: 'Nuclear weapon states'
            //             },
            //             labels: {
            //                 formatter: function () {
            //                     return this.value / 1000 + 'k';
            //                 }
            //             }
            //         },
            //         tooltip: {
            //             pointFormat: '{series.name} produced <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
            //         },
            //         plotOptions: {
            //             area: {
            //                 pointStart: 1940,
            //                 marker: {
            //                     enabled: false,
            //                     symbol: 'circle',
            //                     radius: 2,
            //                     states: {
            //                         hover: {
            //                             enabled: true
            //                         }
            //                     }
            //                 }
            //             }
            //         },
            //         series: [{
            //             name: 'USA',
            //             data: [null, null, null, null, null, 6, 11, 32, 110, 235, 369, 640,
            //                 1005, 1436, 2063, 3057, 4618, 6444, 9822, 15468, 20434, 24126,
            //                 27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342, 26662,
            //                 26956, 27912, 28999, 28965, 27826, 25579, 25722, 24826, 24605,
            //                 24304, 23464, 23708, 24099, 24357, 24237, 24401, 24344, 23586,
            //                 22380, 21004, 17287, 14747, 13076, 12555, 12144, 11009, 10950,
            //                 10871, 10824, 10577, 10527, 10475, 10421, 10358, 10295, 10104]
            //         }, {
            //             name: 'USSR/Russia',
            //             data: [null, null, null, null, null, null, null, null, null, null,
            //                 5, 25, 50, 120, 150, 200, 426, 660, 869, 1060, 1605, 2471, 3322,
            //                 4238, 5221, 6129, 7089, 8339, 9399, 10538, 11643, 13092, 14478,
            //                 15915, 17385, 19055, 21205, 23044, 25393, 27935, 30062, 32049,
            //                 33952, 35804, 37431, 39197, 45000, 43000, 41000, 39000, 37000,
            //                 35000, 33000, 31000, 29000, 27000, 25000, 24000, 23000, 22000,
            //                 21000, 20000, 19000, 18000, 18000, 17000, 16000]
            //         }]
            //     }
            //  $scope.$apply();
            //  $($window).resize();
            // }, 1000);

           /* $scope.toggleRight = function () {
                $mdSidenav('right').toggle();
            }
            $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
            $scope.series = ['Revenue', 'Cost', 'Profit', 'eCPM', 'Network eCPM'];
            $scope.data = [
                [10000, 15000, 30000, 14000, 12000, 25500, 11000],
                [28, 48, 45, 19, 88, 27, 30],
                [12, 53, 15, 9, 50, 70, 10],
                [0.5, 1, 1.5, 2, 1.78, 3, 0.6],
                [8, 36, 80, 9, 25, 97, 65]
            ];
            $scope.options ={
                datasetStrokeWidth : 3,
                scaleGridLineWidth : 1,
                scaleFontSize: 12,
                responsive: true,
                maintainAspectRatio: true,
                tooltipFontSize: 14,
                scaleGridLineColor : "rgba(255,255,255,.05)",
                scaleLineColor: "rgba(255,87,34,1)",
                scaleFontColor: "#666",
                pointDotRadius : 6
            }
            $scope.colours = [{ // default
              "fillColor": "rgba(224, 108, 112, 1)",
              "strokeColor": "rgba(207,100,103,1)",
              "pointColor": "rgba(220,220,220,1)",
              "pointStrokeColor": "#fff",
              "pointHighlightFill": "#fff",
              "pointHighlightStroke": "rgba(151,187,205,0.8)"
            }]
            $scope.onClick = function (points, evt) {
                console.log(points, evt);
            };*/


            /*$scope.dataTables = {
                "name": "Dashboard Cache",
                "version": "1.0.0",
                "widgets": [{ type: 1,
                  name: 'table_1',
                  title: 'Tabla de ganancias por dia',
                  columns: 
                   [ { name: 'day', index: 0, alias: 'Fecha', width: 100 },
                     { name: 'imps', index: 1, alias: 'Imps', width: 80 },
                     { name: 'impsn', index: 2, alias: 'Network Imps', width: 80 },
                     { name: 'ecpm', index: 3, alias: 'Revenue eCPM', width: 80 },
                     { name: 'ecpmn', index: 4, alias: 'Network eCPM', width: 80 },
                     { name: 'cost', index: 5, alias: 'Cost', width: 80 },
                     { name: 'profit', index: 6, alias: 'Profit', width: 80 },
                     { name: 'rev_share', index: 7, alias: 'Rev Share Med', width: 80 },
                     { name: 'cost_ecpm', index: 8, alias: 'Cost eCPM', width: 80 },
                     { name: 'profit_ecpm', index: 9, alias: 'Profit eCPM', width: 80 } ],
                  data: 
                   [ [ '2015-11-16',
                       39875738,
                       10188663,
                       0.628,
                       2.456,
                       20244.3,
                       4782.5424,
                       80.89,
                       0.508,
                       0.12 ],
                     [ '2015-11-15',
                       47976423,
                       12243215,
                       0.611,
                       2.396,
                       23728.53,
                       5603.2851,
                       80.9,
                       0.495,
                       0.117 ],
                     [ '2015-11-14',
                       46032219,
                       11790089,
                       0.67,
                       2.614,
                       24811.83,
                       6007.1396,
                       80.51,
                       0.539,
                       0.13 ],
                     [ '2015-11-13',
                       39817088,
                       10197258,
                       0.654,
                       2.553,
                       20999.86,
                       5033.85,
                       80.66,
                       0.527,
                       0.126 ],
                     [ '2015-11-12',
                       39936407,
                       10368155,
                       0.605,
                       2.33,
                       19350.28,
                       4809.018,
                       80.09,
                       0.485,
                       0.12 ],
                     [ '2015-11-11',
                       36339907,
                       9291274,
                       0.641,
                       2.508,
                       18768.16,
                       4534.7387,
                       80.54,
                       0.516,
                       0.125 ],
                     [ '2015-11-10',
                       36932206,
                       9514815,
                       0.63,
                       2.446,
                       18691.74,
                       4582.5317,
                       80.31,
                       0.506,
                       0.124 ],
                     [ '2015-11-09',
                       39205908,
                       10002719,
                       0.597,
                       2.338,
                       18835.74,
                       4551.5488,
                       80.54,
                       0.48,
                       0.116 ],
                     [ '2015-11-08',
                       55825663,
                       14356476,
                       0.525,
                       2.04,
                       23560.3,
                       5721.8525,
                       80.46,
                       0.422,
                       0.102 ] ] }]
            }*/

            $scope.dataTables = [];
            $scope.loadingTables = true;

            $scope.stopLoading = function () {
                $scope.loadingTables = false;
            }

            if ($scope.$parent.logged) {
                webservice.get('/dashboardNetwork', function (data) {
                    console.log('descargo');
                    var search = 0;
                    var dataTables = data[0];
                    for (var i = 0; i < dataTables.widgets.length; i++) {
                        dataTables.widgets[i].limit = 30;
                        for (var j = 0; j < dataTables.widgets[i].columns.length; j++) {
                          search = 0;
                            while ((dataTables.widgets[i].data[search][j] == undefined) && (search<dataTables.widgets[i].data.length)) {
                                search++;
                            }
                            if (search < dataTables.widgets[i].data.length){
                                if (!isNaN(dataTables.widgets[i].data[search][j])) {
                                    dataTables.widgets[i].columns[j].type = 'number';
                                }else{
                                    if (!isNaN(dataTables.widgets[i].data[search][j].substring(0, 4)) && (dataTables.widgets[i].data[search][j].substring(4, 5) == '-'))
                                        dataTables.widgets[i].columns[j].type = 'date';
                                    else
                                        dataTables.widgets[i].columns[j].type = 'text';
                                }
                            }
                        };
                    };
                    console.log('proceso');
                    $scope.dataTables = dataTables;
                }, function (data) {
                    console.log('Error');
                });
            }

            $scope.getColumns = function (cols) {
                console.log('entra');
                var template = '<tr>';
                for (var i = 0; i < cols.length; i++) {
                    template += '<td>'+cols.alias+'</td>'
                };
                template += '</tr>';
                console.log(template);
                return template;
            }

            $scope.plus30 = function (table) {
                table.limit += 30;
            }

            $scope.visible = function (table) {
                return (table.data.length > table.limit);
            }

        });

})();