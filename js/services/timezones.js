( function () {

	var ser = angular.module('timezones', []);

	ser.factory('timezone', function(){
		this.list = [
			{id: 1, value: -12, description: '(GMT-12:00) International Date Line West'},
			{id: 2, value: -11, description: '(GMT-11:00) Midway Island, Samoa'},
			{id: 3, value: -10, description: '(GMT-10:00) Hawaii'},
			{id: 4, value: -9, description: '(GMT-09:00) Alaska'},
			{id: 5, value: -8, description: '(GMT-08:00) Pacific Time (US and Canada); Tijuana'},
			{id: 6, value: -7, description: '(GMT-07:00) Mountain Time (US and Canada)'},
			{id: 7, value: -7, description: '(GMT-07:00) Chihuahua, La Paz, Mazatlan'},
			{id: 8, value: -7, description: '(GMT-07:00) Arizona'},
			{id: 9, value: -6, description: '(GMT-06:00) Central Time (US and Canada'},
			{id: 10, value: -6, description: '(GMT-06:00) Saskatchewan'},
			{id: 11, value: -6, description: '(GMT-06:00) Guadalajara, Mexico City, Monterrey'},
			{id: 12, value: -6, description: '(GMT-06:00) Central America'},
			{id: 13, value: -5, description: '(GMT-05:00) Eastern Time (US and Canada)'},
			{id: 14, value: -5, description: '(GMT-05:00) Indiana (East)'},
			{id: 15, value: -5, description: '(GMT-05:00) Bogota, Lima, Quito'},
			{id: 16, value: -4, description: '(GMT-04:00) Atlantic Time (Canada)'},
			{id: 17, value: -4, description: '(GMT-04:00) Caracas, La Paz'},
			{id: 18, value: -4, description: '(GMT-04:00) Santiago'},
			{id: 19, value: -3, description: '(GMT-03:30) Newfoundland and Labrador'},
			{id: 20, value: -3, description: '(GMT-03:00) Brasilia'},
			{id: 21, value: -3, description: '(GMT-03:00) Buenos Aires, Georgetown'},
			{id: 22, value: -3, description: '(GMT-03:00) Greenland'},
			{id: 23, value: -2, description: '(GMT-02:00) Mid-Atlantic'},
			{id: 24, value: -1, description: '(GMT-01:00) Azores'},
			{id: 25, value: -1, description: '(GMT-01:00) Cape Verde Islands'},
			{id: 26, value: 0, description: '(GMT) Greenwich Mean Time: Dublin, Edinburgh, Lisbon, London'},
			{id: 27, value: 0, description: '(GMT) Casablanca, Monrovia'},
			{id: 28, value: 1, description: '(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague'},
			{id: 29, value: 1, description: '(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb'},
			{id: 30, value: 1, description: '(GMT+01:00) Brussels, Copenhagen, Madrid, Paris'},
			{id: 31, value: 1, description: '(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna'},
			{id: 32, value: 1, description: '(GMT+01:00) West Central Africa'},
			{id: 33, value: 2, description: '(GMT+02:00) Bucharest'},
			{id: 34, value: 2, description: '(GMT+02:00) Cairo'},
			{id: 35, value: 2, description: '(GMT+02:00) Helsinki, Kiev, Riga, Sofia, Tallinn, Vilnius'},
			{id: 36, value: 2, description: '(GMT+02:00) Athens, Istanbul, Minsk'},
			{id: 37, value: 2, description: '(GMT+02:00) Jerusalem'},
			{id: 38, value: 2, description: '(GMT+02:00) Harare, Pretoria'},
			{id: 39, value: 3, description: '(GMT+03:00) Moscow, St. Petersburg, Volgograd'},
			{id: 40, value: 3, description: '(GMT+03:00) Kuwait, Riyadh'},
			{id: 41, value: 3, description: '(GMT+03:00) Nairobi'},
			{id: 42, value: 3, description: '(GMT+03:00) Baghdad'},
			{id: 43, value: 3, description: '(GMT+03:30) Tehran'},
			{id: 44, value: 4, description: '(GMT+04:00) Abu Dhabi, Muscat'},
			{id: 45, value: 4, description: '(GMT+04:00) Baku, Tbilisi, Yerevan'},
			{id: 46, value: 4, description: '(GMT+04:30) Kabul'},
			{id: 47, value: 5, description: '(GMT+05:00) Ekaterinburg'},
			{id: 48, value: 5, description: '(GMT+05:00) Islamabad, Karachi, Tashkent'},
			{id: 49, value: 5, description: '(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi'},
			{id: 50, value: 5, description: '(GMT+05:45) Kathmandu'},
			{id: 51, value: 6, description: '(GMT+06:00) Astana, Dhaka'},
			{id: 52, value: 6, description: '(GMT+06:00) Sri Jayawardenepura'},
			{id: 53, value: 6, description: '(GMT+06:00) Almaty, Novosibirsk'},
			{id: 54, value: 6, description: '(GMT+06:30) Yangon Rangoon'},
			{id: 55, value: 7, description: '(GMT+07:00) Bangkok, Hanoi, Jakarta'},
			{id: 56, value: 7, description: '(GMT+07:00) Krasnoyarsk'},
			{id: 57, value: 8, description: '(GMT+08:00) Beijing, Chongqing, Hong Kong SAR, Urumqi'},
			{id: 58, value: 8, description: '(GMT+08:00) Kuala Lumpur, Singapore'},
			{id: 59, value: 8, description: '(GMT+08:00) Taipei'},
			{id: 60, value: 8, description: '(GMT+08:00) Perth'},
			{id: 61, value: 8, description: '(GMT+08:00) Irkutsk, Ulaanbaatar'},
			{id: 62, value: 9, description: '(GMT+09:00) Seoul'},
			{id: 63, value: 9, description: '(GMT+09:00) Osaka, Sapporo, Tokyo'},
			{id: 64, value: 9, description: '(GMT+09:00) Yakutsk'},
			{id: 65, value: 9, description: '(GMT+09:30) Darwin'},
			{id: 66, value: 9, description: '(GMT+09:30) Adelaide'},
			{id: 67, value: 10, description: '(GMT+10:00) Canberra, Melbourne, Sydney'},
			{id: 68, value: 10, description: '(GMT+10:00) Brisbane'},
			{id: 69, value: 10, description: '(GMT+10:00) Hobart'},
			{id: 70, value: 10, description: '(GMT+10:00) Vladivostok'},
			{id: 71, value: 10, description: '(GMT+10:00) Guam, Port Moresby'},
			{id: 72, value: 11, description: '(GMT+11:00) Magadan, Solomon Islands, New Caledonia'},
			{id: 73, value: 12, description: '(GMT+12:00) Fiji Islands, Kamchatka, Marshall Islands'},
			{id: 74, value: 12, description: '(GMT+12:00) Auckland, Wellington'},
			{id: 75, value: 13, description: '(GMT+13:00) Nuku\'alofa'}
		]
		return this;
	})

})();