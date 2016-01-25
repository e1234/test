( function () {

	var ser = angular.module('Idioma', []);

	ser.factory('idioma', function(){
		this.spanish = {
			home: {
				revenueTitle: 'REPORTE DE INGRESOS',
				performance: 'REPORTE DE RENDIMIENTO',
				custom: 'REPORTE PERSONALIZADO',
				referers: 'REFERIDOS',
				impresiones: 'IMPRESIONES',
				lmonth: 'ULTIMO MES',
				cmonth: 'MES ACTUAL',
				lweek: 'SEMANA PASADA',
				today: 'HOY',
				fecha: 'FECHA',
				totalEarning: 'GANANCIAS TOTALES',
				l7days: 'ULTIMOS 7 DIAS',
				formatNot: 'FORMATO NO DETECTADO EN SUS PAGINAS',
				instalFormat: 'INSTALAR FORMATO',
				adFormat: 'ELIJA LOS FORMATOS DE AVISO',
				showStats: 'MOSTRAR ESTADISTICAS SOLO PARA:',
				custom: 'PERSONALIZADO',
				country: 'pais',
				device: 'dispositivo',
				section: 'seccion',
				size: 'medida',
				revenueDevice: 'ganancias por dispositivo',
				revenueCountry: 'ganancias por pais',
				seleDate: 'seleccione la fecha',
				today: 'hoy',
				yesterday: 'ayer',
				byesterday: 'anteayer',
				revenue: 'GANANCIAS',
				traffic: '% DE TRAFICO',
				filter: 'filtrar por',
				defecto: '(por defecto: todos)'
			}
		}
		this.english = {
			home: {
				revenueTitle: 'REVENUE REPORT',
				performance: 'PERFORMANCE REPORT',
				custom: 'CUSTOM REPORT',
				referers: 'REFERERS',
				impresiones: 'IMPRESSIONS',
				lmonth: 'LAST MONTH',
				cmonth: 'CURRENT MONTH',
				lweek: 'LAST WEEK',
				today: 'TODAY',
				fecha: 'DATE',
				totalEarning: 'TOTAL EARNING',
				l7days: 'LAST 7 DAYS',
				formatNot: 'FORMAT NOT DETECTED ON YOUR PAGES',
				instalFormat: 'INSTALL FORMAT',
				adFormat: 'CHOOSE THE AD FORMATS',
				showStats: 'SHOWING STATS ONLY FOR:',
				custom: 'CUSTOM',
				country: 'country',
				device: 'device',
				section: 'seccion',
				size: 'size',
				revenueDevice: 'revenue by device',
				revenueCountry: 'revenue by country',
				seleDate: 'select the date',
				today: 'today',
				yesterday: 'yesterday',
				byesterday: 'before yesterday',
				revenue: 'REVENUE',
				traffic: '% OF TRAFFIC',
				filter: 'filter by',
				defecto: '(default: all)'
			}
		}
		return this;
	})

})();