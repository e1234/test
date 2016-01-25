( function () {

	var c=document.createElement('canvas');
	var ctx=c.getContext('2d');
	ctx.font = '12px ' + 'sans-serif';
	String.prototype.visualLength = function()
	{
		return ctx.measureText(this).width;
	}

	var nc=document.createElement('canvas');
	var nctx=nc.getContext('2d');
	nctx.font = '17px ' + 'sans-serif';
	String.prototype.visualLengthHeader = function()
	{
		return nctx.measureText(this).width;
	}

	var ser = angular.module('ReportService', []);

	ser.factory('reportService',  function () {

		var alias = {
			clicks: 'Clicks',
			clicksu: 'UClicks',
			convs: 'Convs',
			convs_2: 'Convs2',
			convs_3: 'Convs3',
			cost: 'Cost',
			defaults: 'Defaults',
			imps: 'Imps',
			revenue_2: 'Revenue2',
			revenue_3: 'Revenue3',
			wrong_referers: 'Wrong Refs'
		};

		this.generate = function (data, noColumns, callback) {
			var footer = {};
			var columns = [];
			var anchos = {};
			var number = 0;
			var auxNumber = 0;
			var currency = '$ (USD)';
			var $ecpm = '$ eCPM';
			footer.clicks = 0;
			footer.clicksu = 0;
			footer.convs = 0;
			footer.convs_2 = 0;
			footer.convs_3 = 0;
			footer.defaults = 0;
			footer.imps = 0;
			footer.impsn = 0;
			footer.impsu = 0;
			footer.profit = 0;
			footer.revenue = 0;
			footer.revenue_2 = 0;
			footer.revenue_3 = 0;
			footer.wrong_referers = 0;
			footer.cost = 0;
			for (var i = 0; i < data.length; i++) {
				footer.clicks += data[i]. clicks;
				footer.clicksu += data[i].clicksu;
				footer.convs += data[i].convs;
				footer.convs_2 += data[i].convs_2;
				footer.convs_3 += data[i].convs_3;
				footer.defaults += data[i].defaults;
				footer.imps += data[i].imps;
				footer.impsn += data[i].impsn;
				footer.impsu += data[i].impsu;
				footer.profit += data[i].profit;
				footer.revenue += data[i].revenue;
				footer.revenue_2 += data[i].revenue_2;
				footer.revenue_3 += data[i].revenue_3;
				footer.wrong_referers += data[i].wrong_referers;
				data[i].cost = data[i].revenue - data[i].profit;
				footer.cost += data[i].cost;
				if (data[i].clicks && data[i].revenue && data[i].impsn) {
					data[i].revenueEcpc = parseFloat((data[i].revenue/data[i].clicks).toFixed(2));
					data[i].revenueEcpmN = parseFloat((data[i].revenue*1000/data[i].impsn).toFixed(2));
				}else{
					data[i].revenueEcpc = 0;
					data[i].revenueEcpmN = 0;
				}
				if (data[i].clicks) {
					data[i].conversionRateClicks = data[i].convs/data[i].clicks*100;
					if (data[i].convs)
						data[i].conversionRateClicks2 = '1:'+(data[i].clicks/data[i].convs).toFixed(0);
					else
						data[i].conversionRateClicks2 = '0';
					data[i].revenueEcpc = data[i].revenue/data[i].clicks;
				}else{
					data[i].conversionRateClicks = 0;
					data[i].revenueEcpc = 0;
					data[i].conversionRateClicks2 = '0';
				}
				if (data[i].imps) {
					data[i].conversionRateImps = data[i].convs/data[i].imps;
					data[i].costEcpm = data[i].cost*1000/data[i].imps;
					data[i].ctr = data[i].clicks/data[i].imps;
					data[i].profitEcpm = data[i].profit*1000/data[i].imps;
					data[i].revenueEcpm = data[i].revenue*1000/data[i].imps;
					data[i].revenue2Ecpm = data[i].revenue_2*1000/data[i].imps;
					data[i].revenue3Ecpm = data[i].revenue_3*1000/data[i].imps;
					if (data[i].convs)
						data[i].conversionRateImps2 = '1:'+(data[i].imps/data[i].convs).toFixed(0);
					else
						data[i].conversionRateImps2 = '0';
				}else{
					data[i].conversionRateImps = 0;
					data[i].conversionRateimps2 = '0';
					data[i].costEcpm = 0;
					data[i].ctr = 0;
					data[i].profitEcpm = 0;
					data[i].revenueEcpm = 0;
					data[i].revenue2Ecpm = 0;
					data[i].revenue3Ecpm = 0;
				}
				if (data[i].revenue)
					data[i].revenueShareProfit = data[i].profit*100/data[i].revenue;
				else
					data[i].revenueShareProfit = 0;
				if (data[i].revenueShareProfit)
					data[i].revenueShare = 100 - data[i].revenueShareProfit;
				else
					data[i].revenueShare = 0;
				if (data[i].impsn) {
					footer.revenueEcpmN = footer.revenue*1000/footer.impsn;
				}else{
					footer.revenueEcpmN = 0;
				}
				if (data[i].creative) {
					data[i].creativeUrl = 'http://engine.smartadtags.com/creative?id='+data[i].hash+'&ext='+data[i].creative_ext;
				}
				if (data[i].hash && data[i].hash_ext) {
					data[i].hashUrl = 'http://engine.smartadtags.com/creative?id='+data[i].hash+'&ext='+data[i].hash_ext;
				}
				if (data[i].hour)
					data[i].hour = parseInt(data[i].hour);
			}
			footer.conversionRateClicks = footer.convs/footer.clicks;
			footer.conversionRateImps = footer.convs/footer.imps;
			footer.conversionRateClicks2 = '1:'+(footer.clicks/footer.convs).toFixed(0);
			footer.conversionRateImps2 = '1:'+(footer.imps/footer.convs).toFixed(0);
			footer.costEcpm = footer.cost*1000/footer.imps;
			footer.ctr = footer.clicks/footer.imps;
			footer.profitEcpm = footer.profit*1000/footer.imps;
			footer.revenueEcpm = footer.revenue*1000/footer.imps;
			footer.revenue2Ecpm = footer.revenue_2*1000/footer.imps;
			footer.revenue3Ecpm = footer.revenue_3*1000/footer.imps;
			footer.revenueShareProfit = footer.profit*100/footer.revenue;
			footer.revenueShare = 100 - footer.revenueShareProfit;
			footer.revenueEcpc = footer.revenue/footer.clicks;
			footer.revenueEcpmN = footer.revenue*1000/footer.impsn;
			for (var i = 0; i < data.length; i++) {
				for (var p in data[i]) {
					if (i == 0) {
						if (alias[p]) {
							anchos[p] = alias[p].visualLengthHeader() + 5; //alias[p].length * 8 + 20;
						}else{
							anchos[p] = p.visualLengthHeader() + 5; //p.length * 8 + 20;
						}
					}
					if ((!isNaN(parseFloat(data[i][p])) && isFinite(data[i][p])) && (typeof(data[i][p])!='string')) {
						if ((data[i][p]/data[i][p])!=0) {
							try{
								auxNumber = (data[i][p]).toFixed(4);
							}catch(err){
							}
							number = (auxNumber.toString()).visualLength();
						}else{
							number = ((data[i][p]).toString()).visualLength();
						}
					} else
						number = ((data[i][p]).toString()).visualLength();
					if (!anchos[p]) {
						anchos[p] = number;
						if (anchos[p]<50) {
							//anchos[p] = 50;
						}
					} else {
						if (number>anchos[p]) {
							anchos[p] = number;
						}
					}
				}
			};
			//console.log(noColumns);
			for (p in data[0]) {
				switch (p) {
					case 'clicks':
						if (noColumns['clicks'])
							columns.push({ name: 'Clicks', field: p, type:'number', width: anchos[p]+45, cellTemplate: '<div class="flexbox table-align" style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis; margin: auto;"><div class="open-sans">{{row.entity.clicks | number:0}}</div><span class="table-label">{{(row.entity.clicks * 100 / grid.appScope.footer.clicks) | number:2}}%</span></div>', footerCellTemplate: '<div style="width: 100%; top: 5px;">{{grid.appScope.footer.clicks | number:0}}</div>', myOrder: 6});
						break;
					case 'clicksu':
						if (noColumns['clicksu'])
							columns.push({ name: 'UClicks', field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;" class="open-sans">{{row.entity.clicksu | number:0}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;" class="open-sans">{{grid.appScope.footer.clicksu | number:0}}</div>', myOrder: 7});
						break;
					case 'convs':
						if (noColumns['conversions'])
							columns.push({ name: 'Convs', field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;" class="open-sans">{{row.entity.convs | number:0}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;" class="open-sans">{{grid.appScope.footer.convs | number:0}}</div>', myOrder: 8});
						break;
					case 'convs_2':
						if (noColumns['conversions2'])
							columns.push({ name: 'Convs2', field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;" class="open-sans">{{row.entity.convs_2 | number:0}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;" class="open-sans">{{grid.appScope.footer.convs_2 | number:0}}</div>'});
						break;
					case 'convs_3':
						if (noColumns['conversions3'])
							columns.push({ name: 'Convs3', field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;" class="open-sans">{{row.entity.convs_3 | number:0}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;" class="open-sans">{{grid.appScope.footer.convs_3 | number:0}}</div>'});
						break;
					case 'cost':
						if (noColumns['cost'])
							columns.push({ name: 'Cost', field: p, type:'number', width: anchos[p]+50, cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;" class="open-sans">{{row.entity.cost | number:2}} '+currency+'</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;" class="open-sans">{{grid.appScope.footer.cost | number:2}} '+currency+'</div>', myOrder: 11});
						break;
					case 'defaults':
						if (noColumns['defaults'])
							columns.push({ name: 'Defaults', field: p, type:'number', width: anchos[p]+45, cellTemplate: '<div class="flexbox table-align" style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis; margin: auto;"><div class="open-sans">{{row.entity.defaults | number:0}}</div><span class="table-label">{{(row.entity.defaults * 100 / grid.appScope.footer.defaults) | number:2}}%</span></div>', footerCellTemplate: '<div style="width: 100%; top: 5px;" class="open-sans">{{grid.appScope.footer.defaults | number:0}}</div>', myOrder: 5});
						break;
					case 'imps':
						if (noColumns['impressions'])
							columns.push({ name: 'Imps', field: p, type:'number', width: anchos[p]+45, cellTemplate: '<div class="flexbox table-align" style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis; margin: auto;" ><div class="open-sans">{{row.entity.imps | number:0}}</div><span class="table-label">{{(row.entity.imps * 100 / grid.appScope.footer.imps) | number:2}}%</span></div>', footerCellTemplate: '<div style="width: 100%; top: 5px;" class="open-sans">{{grid.appScope.footer.imps | number:0}}</div>', myOrder: 1});
						break;
					case 'impsn':
						if (noColumns['impsn'])
							columns.push({ name: p, field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;" class="open-sans">{{row.entity.impsn | number:0}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;" class="open-sans">{{grid.appScope.footer.impsn | number:0}}</div>', myOrder: 3});
						break;
					case 'impsu':
						if (noColumns['impsu'])
							columns.push({ name: p, field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;" class="open-sans">{{row.entity.impsu | number:0}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;" class="open-sans">{{grid.appScope.footer.impsu | number:0}}</div>', myOrder: 2});
						break;
					case 'profit':
						if (noColumns['profit'])
							columns.push({ name: p, field: p, type:'number', width: anchos[p]+50, cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;" class="open-sans">{{row.entity.profit | number:2}} '+currency+'</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;" class="open-sans">{{grid.appScope.footer.profit | number:2}} '+currency+'</div>', myOrder: 12});
						break;
					case 'revenue':
						if (noColumns['revenue'])
							columns.push({ name: p, field: p, type:'number', width: anchos[p]+120, cellTemplate: '<div class="flexbox table-align" style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis; margin: auto;"><div class="open-sans">{{row.entity.revenue | number:2}} '+currency+'</div><span class="table-label">{{(row.entity.revenue * 100 / grid.appScope.footer.revenue) | number:2}}%</span></div>', footerCellTemplate: '<div style="width: 100%; top: 5px;" class="open-sans">{{grid.appScope.footer.revenue | number:2}} '+currency+'</div>', myOrder: 9});
						break;
					case 'revenue_2':
						if (noColumns['revenue2'])
							columns.push({ name: 'Revenue2', field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;" class="open-sans">{{row.entity.revenue_2 | number:2}} '+currency+'</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;" class="open-sans">{{grid.appScope.footer.revenue_2 | number:2}} '+currency+'</div>', myOrder: 24});
						break;
					case 'revenue_3':
						if (noColumns['revenue3'])
							columns.push({ name: 'Revenue3', field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;" class="open-sans">{{row.entity.revenue_3 | number:2}} '+currency+'</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;" class="open-sans">{{grid.appScope.footer.revenue_3 | number:2}} '+currency+'</div>', myOrder: 25});
						break;
					case 'wrong_referers':
						if (noColumns['wrongReferers'])
							columns.push({ name: 'Wrong Refs', field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;" class="open-sans">{{row.entity.wrong_referers | number:0}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;" class="open-sans">{{grid.appScope.footer.wrong_referers | number:0}}</div>', myOrder: 4});
						break;
					case 'conversionRateClicks':
						if (noColumns['conversionRateClicks'])
							columns.push({ name: 'CR Clicks', field: p, type:'number', width: anchos[p]-45, cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;" class="open-sans">{{row.entity.conversionRateClicks | number:4}} %</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;" class="open-sans">{{grid.appScope.footer.conversionRateClicks | number:4}} %</div>', myOrder: 18});
						break;
					case 'conversionRateClicks2':
						if (noColumns['conversionRateClicks'])
							columns.push({ name: 'CR Clicks 2', field: p, width: anchos[p]-45, cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;" class="open-sans">{{row.entity.conversionRateClicks2}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;" class="open-sans">{{grid.appScope.footer.conversionRateClicks2}}</div>', myOrder: 19});
						break;
					case 'conversionRateImps':
						if (noColumns['conversionRateImps'])
							columns.push({ name: 'CR Imps', field: p, type:'number', width: anchos[p]-45, cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;" class="open-sans">{{row.entity.conversionRateImps | number:4}} %</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;" class="open-sans">{{grid.appScope.footer.conversionRateImps | number:4}} %</div>', myOrder: 16});
						break;
					case 'conversionRateImps2':
						if (noColumns['conversionRateImps'])
							columns.push({ name: 'CR Imps 2', field: p, width: anchos[p]-45, cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;" class="open-sans">{{row.entity.conversionRateImps2}}</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;" class="open-sans">{{grid.appScope.footer.conversionRateImps2}}</div>', myOrder: 17});
						break;
					case 'costEcpm':
						if (noColumns['costEcpm'])
							columns.push({ name: p, field: p, type:'number', width: anchos[p]+30, cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;" class="open-sans">{{row.entity.costEcpm | number:4}} '+$ecpm+'</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;" class="open-sans">{{grid.appScope.footer.costEcpm | number:4}} '+$ecpm+'</div>', myOrder: 21});
						break;
					case 'ctr':
						if (noColumns['ctr'])
							columns.push({ name: p, field: p, type:'number', width: anchos[p]+30, cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;" class="open-sans">{{row.entity.ctr | number:4}} %</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;" class="open-sans">{{grid.appScope.footer.ctr | number:4}} %</div>', myOrder: 15});
						break;
					case 'profitEcpm':
						if (noColumns['profitEcpm'])
							columns.push({ name: p, field: p, type:'number', width: anchos[p]+30, cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;" class="open-sans">{{row.entity.profitEcpm | number:4}} '+$ecpm+'</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;" class="open-sans">{{grid.appScope.footer.profitEcpm | number:4}} '+$ecpm+'</div>', myOrder: 22});
						break;
					case 'revenueEcpm':
						if (noColumns['revenueEcpm'])
							columns.push({ name: p, field: p, type:'number', width: anchos[p]+30, cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;" class="open-sans">{{row.entity.revenueEcpm | number:3}} '+$ecpm+'</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;" class="open-sans">{{grid.appScope.footer.revenueEcpm | number:4}} '+$ecpm+'</div>', myOrder: 10});
						break;
					case 'revenueShare':
						if (noColumns['revenueShare'])
							columns.push({ name: p, field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;" class="open-sans">{{row.entity.revenueShare | number:2}} %</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;" class="open-sans">{{grid.appScope.footer.revenueShare | number:4}} %</div>', myOrder: 13});
						break;
					case 'revenueShareProfit':
						if (noColumns['revenueShareProfit'])
							columns.push({ name: p, field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;" class="open-sans">{{row.entity.revenueShareProfit | number:2}} %</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;" class="open-sans">{{grid.appScope.footer.revenueShareProfit | number:4}} %</div>', myOrder: 14});
						break;
					case 'revenue2Ecpm':
						if (noColumns['revenue2Ecpm'])
							columns.push({ name: p, field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;" class="open-sans">{{row.entity.revenue2Ecpm | number:3}} '+$ecpm+'</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;" class="open-sans">{{grid.appScope.footer.revenue2Ecpm | number:4}} '+$ecpm+'</div>', myOrder: 26});
						break;
					case 'revenue3Ecpm':
						if (noColumns['revenue3Ecpm'])
							columns.push({ name: p, field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;" class="open-sans">{{row.entity.revenue3Ecpm | number:3}} '+$ecpm+'</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;" class="open-sans">{{grid.appScope.footer.revenue3Ecpm | number:4}} '+$ecpm+'</div>', myOrder: 27});
						break;
					case 'revenueEcpc':
						if (noColumns['revenueEcpc'])
							columns.push({ name: p, field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;" class="open-sans">{{row.entity.revenueEcpc | number:4}} eCPC</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;" class="open-sans">{{grid.appScope.footer.revenueEcpc | number:4}} eCPC</div>', myOrder: 20});
						break;
					case 'revenueEcpmN':
						if (noColumns['revenueEcpmN'])
							columns.push({ name: p, field: p, type:'number', width: anchos[p], cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;" class="open-sans">{{row.entity.revenueEcpmN | number:4}} '+$ecpm+'</div>', footerCellTemplate: '<div style="width: 100%; top: 5px;" class="open-sans">{{grid.appScope.footer.revenueEcpmN | number:4}} '+$ecpm+'</div>', myOrder: 23});
						break;
					case 'publisher_name':
					case 'manager_name':
					case 'li_payout':
					case 'li_offerid':
					case 'li_offername':
					case 'country':
					case 'creative_ext':
					case 'hash_ext':
					case 'device':
					case 'platform':
					case 'nav':
					case 'li_status':
					case 'creative_status':
					case 'creativeUrl':
					case 'hashUrl':
					case 'publisher':
					case 'manager':
					case 'site':
					case 'section_name':
					case 'channel':
					case 'size':
					case 'advertiser':
					case 'convs3':
					case 'connection':
					case 'offer_preview':
					//case 'li_name':
						break;
					case 'creative':
						columns.push({ name: p, width: anchos[p], field: p, myOrder: 0, cellTemplate: '<div style="text-decoration: none; width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis; cursor: pointer;" class="open-sans" ng-style="{\'color\': (row.entity.creative_status)?\'green\':\'red\'}" ng-click="viewImg = !viewImg" ng-class="{\'table-image\': viewImg}"><span>{{row.entity.creative}}</span><div ng-if="viewImg" style="position: absolute; background-color: white;" class="md-whiteframe-z2"><img ng-if="((row.entity.creative_ext != \'txt\')&&(row.entity.creative_ext != \'html\'))" ng-src="{{row.entity.creativeUrl}}"></img><div style="max-width: 500px; max-height: 500px;" ng-if="(row.entity.creative_ext == \'html\')" ng-include="row.entity.creativeUrl"></div></div></div>'});
						break;
					case 'hash':
						columns.push({ name: p, width: anchos[p], field: p, myOrder: 0, cellTemplate: '<div style="text-decoration: none; width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis; cursor: pointer;" class="open-sans" ng-click="viewImg = !viewImg" ng-class="{\'table-image\': viewImg}"><span>{{row.entity.hash}}</span><div ng-if="viewImg" style="position: absolute; background-color: white;" class="md-whiteframe-z2"><img ng-if="((row.entity.hash_ext != \'txt\')&&(row.entity.hash_ext != \'html\'))" ng-src="{{row.entity.hashUrl}}"></img><div style="max-width: 500px; max-height: 500px;" ng-if="(row.entity.hash_ext == \'html\')" ng-include="row.entity.hashUrl"></div></div></div>'});
						break;
					case 'publisher_mail':
						columns.push({ name: p, type: 'string', width: anchos['publisher']+anchos[p], field: p, myOrder: 0, cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;" class="open-sans">{{row.entity.publisher}} - {{row.entity.publisher_mail}}</div>'});
						break;
					case 'manager_mail':
						columns.push({ name: p, type: 'string', width: anchos['manager']+anchos[p], field: p, myOrder: 0, cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;" class="open-sans">{{row.entity.manager}} - {{row.entity.manager_mail}}</div>'});
						break;
					case 'section':
						columns.push({ name: p, type: 'string', width: anchos[p]+anchos['section_name'], field: p, myOrder: 0, cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;" class="open-sans">{{row.entity.section}} - {{row.entity.section_name}}</div>'});
						break;
					case 'site_url':
						columns.push({ name: p, type: 'string', width: anchos['site']+anchos[p], field: p, myOrder: 0, cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;" class="open-sans">{{row.entity.site}} - {{row.entity.site_url}}</div>'});
						break;
					case 'li':
						columns.push({ name: p, type: 'string', width: anchos[p]+anchos['li_name'], field: p, myOrder: 0, cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;" class="open-sans" ng-style="{\'color\': (row.entity.li_status)?\'green\':\'red\'}">{{row.entity.li}} - {{row.entity.li_name}}</div>'});
						break;
					case 'channel_name':
						columns.push({ name: p, type: 'string', width: anchos['channel']+anchos[p], field: p, myOrder: 0, cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;" class="open-sans">{{row.entity.channel}} - {{row.entity.channel_name}}</div>'});
						break;
					case 'size_name':
						columns.push({ name: p, type: 'string', width: anchos['size']+anchos[p], field: p, myOrder: 0, cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;" class="open-sans">{{row.entity.size}} - {{row.entity.size_name}}</div>'});
						break;
					case 'advertiser_name':
						columns.push({ name: p, type: 'string', width: anchos['advertiser']+anchos[p], field: p, myOrder: 0, cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;" class="open-sans">{{row.entity.advertiser}} - {{row.entity.advertiser_name}}</div>'});
						break;
					case 'offer':
						columns.push({ name: p, type: 'number', width: anchos[p], field: p, myOrder: 0, cellTemplate: '<div style="width: 100%; top: 5px; overflow: hidden; text-overflow: ellipsis;" class="open-sans"><a target="_blank" ng-href="{{row.entity.offer_preview}}" style="display: block; text-decoration: none; color: #000;">{{row.entity.offer}}</a></div>'});
						break;
					case 'of_payout':
						columns.push({ name: p, width: anchos[p], field: p, type:'number', myOrder: 0});
						break;
					case 'hour':
						columns.push({ name: p, width: anchos[p], field: p, type:'number', sort: {direction: 'asc', priority: 2}, myOrder: 0});
						break;
					case 'day':
						columns.push({ name: 'date', width: anchos[p]+20, field: p, sort: {direction: 'asc', priority: 1}, myOrder: 0});
						break;
					case 'month':
						columns.push({ name: p, width: anchos[p]+20, field: p, sort: {direction: 'asc', priority: 3}, myOrder: 0});
						break;
					case 'year':
						columns.push({ name: p, width: anchos[p]+20, field: p, sort: {direction: 'asc', priority: 4}, myOrder: 0});
						break;
					default:
						columns.push({ name: p, field: p, width: anchos[p]+20, myOrder: 0});
						break;
				}
			}
			var compare = function (a,b) {
			  	if (a.myOrder < b.myOrder)
			    	return -1;
			  	if (a.myOrder > b.myOrder)
			    	return 1;
			  	return 0;
			}
			columns.sort(compare);
			var reportTable = {
				paginationPageSizes: [10, 50, 200, 500],
				paginationPageSize: 50,
				enableFiltering: true,
				enableGridMenu: true,
				enableColumnResizing: true,
				enableSorting: true,
				showColumnFooter: true,
				saveOrder: true,
				saveFocus: true,
				flatEntityAccess: true,
				columnVirtualizationThreshold: 40,
				excessRows: 40,
				rowHeight:22,
				columnDefs: columns,
				enableRowSelection: false,
				enableFullRowSelection: false,
				enableHighlighting : true,
				multiSelect: false,
				data : data
			}
			callback(reportTable, footer);
		}

		if (localStorage.columns && localStorage.columns[0].viewName)
			this.filters = JSON.parse(localStorage.columns);
		else {
			this.filters = [
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
					name: 'conversions2',
					viewName: 'Conversions 2',
					status: true
				},{
					name: 'conversions3',
					viewName: 'Conversions 3',
					status: true
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
					status: true
				},{
					name: 'revenue2',
					viewName: 'Revenue 2',
					status: true
				},{
					name: 'revenue2Ecpm',
					viewName: 'Revenue 2 eCPM',
					status: true
				},{
					name: 'revenue3',
					viewName: 'Revenue 3',
					status: true
				},{
					name: 'revenue3Ecpm',
					viewName: 'Revenue 3 eCPM',
					status: true
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

		return this;
	});

})();
