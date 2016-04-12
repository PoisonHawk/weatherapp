var app = {
	
	key: 'f50761d988cbf1c851891908e4ce0829',
	latitude: null,
	longitude: null,
	daysEn : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	weatherIcons : {
		'Clouds' : 'wi-cloudy',
		'Rain':'wi-rain',
		'Clear': 'wi-day-sunny',
		'Snow': 'wi-snow',
	},
	
	setError: function(text){
		$('.error').text(text).show();	
	},
		
	getCurrentPosition: function(){
		
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
	
	getWeatherData: function(){
	
	var targetUrl = 'http://api.openweathermap.org/data/2.5/forecast/daily?lat='+app.latitude+'&lon='+app.longitude+'&APPID='+app.key+'&callback=?';
		
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
					
					$('#day_'+i+' .temp').text(Math.floor(d.temp.eve));				
					
					$('#day_'+i+' .weather').html('<i class="wi '+app.weatherIcons[d.weather[0].main]+'"></i>');	
					i++;
				})
				
			})
			
			
	},
	
	init: function(){
		
		$('.error').hide();
		
		if (navigator.geolocation){
	
			app.getCurrentPosition();				

		}else {
			app.setError('Browser not supported geo Api');
		}	
	}
}


$(document).ready(function(){
	
	app.init();
	
})