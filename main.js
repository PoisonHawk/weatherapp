var app = {
	
	key: 'f50761d988cbf1c851891908e4ce0829',
	latitude: null,
	longitude: null,
	city:null,
	countryCode:null,
	daysEn : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	weatherIcons : {
		'Clouds' : 'wi-cloudy',
		'Rain':'wi-rain',
		'Clear': 'wi-day-sunny',
		'Snow': 'wi-snow',
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
		var m = date.getMinutes();		
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
					
					$('#day_'+i+' .weather').html('<i class="wi '+app.weatherIcons[d.weather[0].main]+'"></i>');	
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