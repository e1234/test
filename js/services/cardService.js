( function () {

	var ser = angular.module('cards', []);

	ser.factory('cardService', ['localservice', 'webservice', 'reportService', 'db', '$rootScope', function (localservice, webservice, reportService, db, $rootScope) {

		var cards = [];
		var self = this;
		var cache = {};

		this.newCards = function (c) {
			var found = false;
			if (Array.isArray(c)) {
				cards = c;
			}else{
				for (var i = 0; i < cards.length; i++) {
					if (cards[i].idReport == c.idReport) {
						for (p in c) {
							if (!(p == 'status' && cards[i].status))
								if (p!='cache') 
									cards[i][p] = c[p];
								else{
									if ((c[p] != '{}') && (c[p]))
										cards[i][p] = c[p];
								}
						}
						//cards[i] = c;
						break;
					}
				}
			}
			//console.log(cards);
			broadCards();
		}

		$rootScope.$on("update",function (event, data) {
			if (data.state) {
				for (var i = 0; i < cards.length; i++) {
					if (cards[i].idReport == data.number) {
						cards[i].status = data.state;
						cards[i].step = 1;
						break;
					}
				};
			}
		});

		$rootScope.$on('socketDelete',function (event, id) {
			for (var i = 0; i < cards.length; i++) {
				if (cards[i].idReport == id) {
					cards.splice(i, 1);
					break;
				}
			}
			broadCards();
		});

		var broadCards = function () {
			var nc = [];
			var c = {};
			var cache;
			for (var i = 0; i < cards.length; i++) {
				c = {};
				if (cards[i].idReport) c.number = cards[i].idReport;
				if (cards[i].ts) c.timestamp = cards[i].ts;
				if (cards[i].name) c.reportName = cards[i].name;
				if (!(cards[i].step)) {
					var p = '';
					if (cards[i].queue) p = ' Position: '+cards[i].queue;
					switch (cards[i].status) {
						case 0:
							c.state = 'In queue.'+p;
							break;
						case 1:
							c.state = 'Generating report';
							break;
						case 2:
							c.state = 'Ready for download';
							break;
						case 3:
						case 4:
						case 5:
							c.state = cards[i].state;
							break;
						case 6: 
							c.state = 'Error';
							c.reportName = cards[i].message;
							break;
						default:
							c.state = 'Ready';
							break;
					}
				}else{
					c.state = cards[i].status;
				}
				c.menuOpen = false;
				c.creator = cards[i].ownerReport;
				if (cards[i].cache && ((typeof cards[i].cache) == 'string')) {
					cache = JSON.parse(cards[i].cache);
					if (cache.autoOpen) c.autoOpen = cache.autoOpen;
					if (cache.filterDesc) c.filterDesc = cache.filterDesc;
					if (cache.interval) c.interval = cache.interval;
					if (cache.filters) c.filters = cache.filters;
					if (cache.oldCard) c.oldCard = cache.oldCard;
				}
				nc.push(c);
			}
			localservice.broadcast('newCards', nc);
		}

		var sendCache = true;

		this.stopCache = function () {
			sendCache = false;
		}

		this.newCard = function (c) {
			cache = {};
			cache.filters = c.filters;
			cache.interval = c.interval;
			cache.filterDesc = c.filterDesc;
			cache.autoOpen = c.autoOpen;
			if (c.oldCard) cache.oldCard = c.oldCard;
		}

		this.updateCard = function (c) {
			var found = false;
			var	index = 0;
			for (var i = 0; i < cards.length; i++) {
				if (cards[i].idReport == c.idReport) {
					found = true;
					index = i;
					break;
				}
			}
			if (!found) {
				if (sendCache) {
					var ch = cache;
					c.cache = JSON.stringify(ch);
					var nc = {};
					nc = JSON.parse(JSON.stringify(c));
					if (!c.name) nc.name = 'Report '+c.idReport;
					if (nc.cache != '{}') {
						if (c.status != 6)
							localservice.broadcast('reportUpdate', nc);
					}
					c.step = 0;
					cards.push(c);
					cache = {};
				}else{
					sendCache = true;
					cards.push(c);
				}
				
			}else{
				for (p in c) {
					if (!(p == 'status' && cards[index].status))
						if (p!='cache')
							cards[index][p] = c[p];
						else{
							if ((c[p] != '{}') && (c[p])) {
								if (!cards[index][p]) {
									if (cache && cache.filters){
										console.log();
										var c2 = JSON.parse(c[p]);
										c2.filters.preFilterData = cache.filters.preFilterData;
										cards[index][p] = JSON.stringify(c2);
									}else{
										cards[index][p] = c[p];
									}
								}else{
									if (cache && cache.filters) {
										cards[index][p] = JSON.stringify(cache);
									}
								}
							}
						}
				};
				if (cards[index].path && cards[index].cache && cards[index].size && !cards[index].downloaded) {
					cards[index].downloaded = true;
					var noColumns = {};
					var fil = JSON.parse(cards[index].cache);
					for (var i = 0; i < fil.filters.preFilterData.length; i++) {
						noColumns[fil.filters.preFilterData[i].name] = fil.filters.preFilterData[i].status;
					};
					var id = c.idReport;
					var size = cards[index].size/1024/1024;
					localservice.broadcast('update', {number: c.idReport, state: 'Downloading report ('+(size.toFixed(2))+'mb)', dwn: true});
					webservice.download(id, cards[index].path, function (data) {
						localservice.broadcast('update', {number: id, state: 'Data processing', noApply: true, dwn: false});
						reportService.generate(data, noColumns, function (table, footer) {
							var nReport = {reportId: id, footer: footer, table: table}
							localservice.broadcast('update', {number: id, state: 'Saving on database', noApply: true});
							db.saveTable(nReport, size).then(function () {
								cards[index].downloaded = false;
								localservice.broadcast('savedOk', id);
								localservice.broadcast('update', {number: id, state: 'Ready', noApply: true});
							}, function (e) {
								console.log(e);
							});
						});
					}, function (data) {
						localservice.broadcast('update', {number: id, state: 'Error downloading'});
					});
				}
			}
			broadCards();
		}

		this.deleteCard = function (id) {
			for (var i = 0; i < cards.length; i++) {
				if (cards[i].idReport == id) {
					cards.splice(i, 1);
					break;
				}
			}
			localservice.broadcast('deleteReport', id);
		}

		return this;
	}]);

})();