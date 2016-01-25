( function () {

	var ser = angular.module('FacMenu', []);

	ser.factory('facMenu', function () {
	  	this.menu = [{
	        	name: 'Dashboard',
	        	icon: 'home',
	        	submenu: [],
	        	selected: false,
	        	code: 0,
	        	production: true
	        }, {
	        	name: 'Reports',
	        	icon: 'poll',
	        	submenu: [],
	        	selected: false,
	        	code: 1,
	        	production: true
	        }, {
	        	name: 'Publishers',
	        	icon: 'person',
	        	submenu: [{
	        		name: 'Administrate',
	        		code: 4,
	        		production: false
	        	},{
	        		name: 'Referreds',
	        		code: 5,
	        		production: true
	        	}],
	        	selected: false,
	        	code: 3,
	        	production: true
	        }, {
	        	name: 'Advertisers',
	        	icon: 'local_play',
	        	submenu: [{
	        		name: 'Administrate',
	        		code: 7,
	        		production: false
	        	},{
	        		name: 'Offers pool',
	        		code: 8,
	        		production: false
	        	},{
	        		name: 'Line items',
	        		code: 9,
	        		production: false
	        	},{
	        		name: 'Creatives pool',
	        		code: 10,
	        		production: false
	        	},{
	        		name: 'A-B test',
	        		code: 11,
	        		production: false
	        	},{
	        		name: 'Forcer',
	        		code: 12,
	        		production: false
	        	},{
	        		name: 'Campaigns',
	        		code: 13,
	        		production: false
	        	},{
	        		name: 'Whitelist',
	        		code: 14,
	        		production: false
	        	}],
	        	selected: false,
	        	code: 6,
	        	production: false
	        }, {
	        	name: 'Administration',
	        	icon: 'equalizer',
	        	submenu: [{
	        		name: 'Categories',
	        		code: 16,
	        		production: true
	        	},{
	        		name: 'Channels',
	        		code: 17,
	        		production: false
	        	},{
	        		name: 'Ad types',
	        		code: 18,
	        		production: false
	        	},{
	        		name: 'Users',
	        		code: 19,
	        		production: false
	        	},{
	        		name: 'Logs',
	        		code: 20,
	        		production: false
	        	}],
	        	selected: false,
	        	code: 15,
	        	production: true
	        }, {
	        	name: 'Exit',
	        	icon: 'logout',
	        	submenu: [],
	        	selected: false,
	        	code: 21,
	        	production: true
	        }];

	  	this.menuENG = this.menu;

	  	return this;
	});

})();