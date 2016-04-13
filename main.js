var app = {
	
	key: 'f50761d988cbf1c851891908e4ce0829',
	latitude: null,
	longitude: null,
	city:null,
	countryCode:null,
	daysEn : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	weatherIcons : {
		'Clouds' : {
			'background':'https://images.unsplash.com/uploads/1412455906842d646f1ce/7bf17d33?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=cfd6d4bc76c77f002a4628a76fb1efcb',
			icon:'wi-cloudy'
				},
		'Rain': {
			background:'https://images.unsplash.com/photo-1433863448220-78aaa064ff47?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=ce34d14f46dfb7fd2f885c16c6b48f3e',
			icon: 'wi-rain',
				},
		'Clear': {
				background:'https://images.unsplash.com/photo-1414269665217-a57681e266b3?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=6fd9f051bea811268593340698b6a822',
				icon: 'wi-day-sunny',
				},	
		'Snow': {
			background:'https://images.unsplash.com/photo-1447754147464-8b29cbf07166?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=259059c824f4009c3c31d84d55d83c5f',
			icon:'wi-snow',
				}

	},
	temp: 'celsius',
	tempKelvin: [],
	ip:true,
	
	setError: function(text){
		$('.error').text(text).show();	
	},
		
	getCurrentPositionFromIp: function(){
		$.getJSON('http://ipinfo.io', function(data){		 
		  app.city = data.city,
		  app.countryCode = data.country;
		  app.getWeatherData();	
		})

	},

	getCurrentPositionFromGeo: function(){
		
		navigator.geolocation.getCurrentPosition(function(position){
			app.latitude = position.coords.latitude;
			app.longitude = position.coords.longitude;			
			app.getWeatherData();		
		});
	},
	
	setTime: function(){
	
		var date = new Date();
		var h = date.getHours();
		h = h<10 ? '0'+ h : h;
		var m = date.getMinutes();	
		m = m <10 ? '0'+ m : m;
		$('#time').text(h+':'+m);
		setTimeout(app.setTime,1000);
	},

	changeTemp: function(){

		$('.temp').map(function(i, el){
				var t = $(this).text();

				if (app.temp === 'celsius') {
					t = 1.8*(app.tempKelvin[i] - 273)+32;
				} else {
					t = app.tempKelvin[i] - 273.15; 
				}
				
				$(this).text(Math.floor(t))
				
				
			})

		$('#FC i').toggleClass('wi-fahrenheit wi-celsius');
					
		app.temp = (app.temp === 'celsius') ? 'fahrenheit' : 'celsius';
		
	},
	
	fromKelvinToCelsius: function(temp){

		return Math.floor(temp - 273.15);
	},

	getBackground: function(text){
		console.log(text);

		console.log(app.weatherIcons[text].background);

		if (typeof app.weatherIcons[text].background !== undefined){
			$('main').css({
				'background-image': 'url('+app.weatherIcons[text].background+')',
			});
		}
	},

	getWeatherData: function(){
	
	if (app.ip){
			var targetUrl = 'http://api.openweathermap.org/data/2.5/forecast/daily?q='+app.city+','+app.countryCode+'&APPID='+app.key+'&callback=?';
	} else {
		var targetUrl = 'http://api.openweathermap.org/data/2.5/forecast/daily?lat='+app.latitude+'&lon='+app.longitude+'&APPID='+app.key+'&callback=?';
	}	
			$.getJSON(targetUrl,{
				format:'json',
			}, function(data){
				
				$('#city').text(data.city.name);
				app.setTime();
				
				var i=0;
				data.list.forEach(function(d){
					console.log(d);
					var cdate = new Date(d.dt*1000);
									
					$('#day_'+i+' .day').text(cdate.getDate());
					
					var dayOfWeek = app.daysEn[cdate.getDay()];
					
					if (i!=0) {
						dayOfWeek = dayOfWeek.substr(0,3);
					}
						$('#day_'+i+' .day_of_week').text(dayOfWeek);
					
					app.tempKelvin.push(d.temp.day);

					$('#day_'+i+' .temp').text(app.fromKelvinToCelsius(d.temp.day));				
					
					$('#day_'+i+' .weather').html('<i class="wi '+app.weatherIcons[d.weather[0].main].icon+'"></i>');	
					i++;
				})

				$('#FC').click(function(){
						app.changeTemp();
					});		

				app.getBackground(data.list[0].weather[0].main);			
				
			})
			
	},
	
	init: function(){
		
		$('.error').hide();
				
		if (app.ip)	{	
				app.getCurrentPositionFromIp();
		}else {	
			if (navigator.geolocation){
		
				app.getCurrentPositionFromGeo();				

			}else {
				app.setError('Browser not supported geo Api');
				app.getCurrentPositionFromIp();
			}	
		}		
	}
}


$(document).ready(function(){

	app.init();
	
})