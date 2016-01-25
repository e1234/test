( function () {

	var ctrl = angular.module('CampListCtrl',[]);

	ctrl.controller('campListCtrl', function($scope, $location, localservice, idioma){

		$scope.showDate = function (date) {
			date = JSON.stringify(date);
			if (date) return date.substring(1, 11);
			else return '';
		}
		var isPublishers = false;
		localservice.broadcast("isPublishers", isPublishers);

		$scope.textos = idioma.getTextos();

		if($location.path() == "/campaignlist") {
			var path = "Campaing List";
			localservice.broadcast("titleReady", path);
		}

		$scope.countryTable1Data = [
			{
				name: "Your name 1",
				source: "Facebook",
				expenditure: 500,
				income: 600,
				profit: 100,
				responsible: "Responsible 1",
				creationDate: "11/01/2015"
			},
			{
				name: "Your name 2",
				source: "Facebook",
				expenditure: 2500,
				income: 2600,
				profit: 100,
				responsible: "Responsible 2",
				creationDate: "17/01/2015"
			},
			{
				name: "Your name 3",
				source: "Google+",
				expenditure: 5000,
				income: 6000,
				profit: 1000,
				responsible: "Responsible 3",
				creationDate: "21/01/2015"
			},
			{
				name: "Your name 4",
				source: "Facebook",
				expenditure: 5000,
				income: 6000,
				profit: 1000,
				responsible: "Responsible 4",
				creationDate: "31/01/2015"
			},
			{
				name: "Your name 4",
				source: "Google+",
				expenditure: 50,
				income: 500,
				profit: 0,
				responsible: "Responsible 4",
				creationDate: "01/02/2015"
			},
			{
				name: "Your name 5",
				source: "Facebook",
				expenditure: 150,
				income: 200,
				profit: 50,
				responsible: "Responsible 5",
				creationDate: "05/02/2015"
			},
			{
				name: "Your name 6",
				source: "Facebook",
				expenditure: 120,
				income: 200,
				profit: 80,
				responsible: "Responsible 6",
				creationDate: "06/02/2015"
			},
			{
				name: "Your name 7",
				source: "Facebook",
				expenditure: 170,
				income: 200,
				profit: 30,
				responsible: "Responsible 7",
				creationDate: "08/02/2015"
			},
			{
				name: "Your name 8",
				source: "Facebook",
				expenditure: 120,
				income: 200,
				profit: 80,
				responsible: "Responsible 8",
				creationDate: "10/02/2015"
			},
			{
				name: "Your name 9",
				source: "Facebook",
				expenditure: 20,
				income: 30,
				profit: 10,
				responsible: "Responsible 9",
				creationDate: "11/02/2015"
			},
			{
				name: "Your name 10",
				source: "Facebook",
				expenditure: 100,
				income: 200,
				profit: 100,
				responsible: "Responsible 10",
				creationDate: "12/02/2015"
			}
		]

		$scope.customTable = {
			paginationPageSizes: [10, 50, 200],
			paginationPageSize: 10,
			enableFiltering: true,
			enableGridMenu: true,
			enableRowSelection: true,
			enableRowHeaderSelection: false,
			multiSelect: false,
			noUnselect: true,
			enableColumnResizing: true,
			enableSorting: true,
			columnDefs: [
				{ name:'Name', field: 'name', headerCellClass: 'table-header' },
				{ name:'Source', field: 'source', headerCellClass: 'table-header' },
				{ name:'Expenditure', field: 'expenditure', headerCellClass: 'table-header'},
				{ name:'Income', field: 'income', headerCellClass: 'table-header'},
				{ name:'Profit', field: 'profit', headerCellClass: 'table-header'},
				{ name:'Responsible', field: 'responsible', headerCellClass: 'table-header'},
				{ name:'Creation date', field: 'creationDate', headerCellClass: 'table-header'}
			],
			data : $scope.countryTable1Data
		}


	});

})();