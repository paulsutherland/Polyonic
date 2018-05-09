(function( $ ) {
	'use strict';
	
	$(document).ready(function(){
		var interval = parseInt(rev_slider_weather_addon.interval);
		

		window.updateWeather();
		if(interval>0){			
			self.setInterval(window.updateWeather, interval*60000);
		}
	});

	window.updateWeather = function() {		
		$('.tp-revslider-mainul li').each(function(){
		 	
		 	var $this = $(this);
		 	var $data = $this.data("param10");		 	
		 	var url = ""; 

		 	
			var name = $data["revslider-weather-addon"]["name"]; 
			var type = $data["revslider-weather-addon"]["type"]; 
			var woeid = $data["revslider-weather-addon"]["woeid"]; 
			var unit = $data["revslider-weather-addon"]["unit"];

			if(type == "woeid"){
				url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20%3D%20' + woeid + '%20and%20u="' + unit + '"&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
			}
			else {
				url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22' + name + '%2C%20ak%22)%20and%20u="' + unit + '"&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
			}

			

			$.getJSON(
				url,
				function(data) {
					
					
					if(data && typeof data === 'object' && data.hasOwnProperty('query') && data.query.hasOwnProperty('results') && data.query.results.hasOwnProperty('channel')) {
						
						var weather_info = data["query"]["results"]["channel"];
						//if(typeof weather_info != "undefined"){
						 
						$this.find("span.revslider_data_weather_title").text(weather_info["title"]);
						$this.find("span.revslider_data_weather_title").text(weather_info["title"]);
						$this.find("span.revslider_data_weather_temp").text(weather_info["item"]["condition"]["temp"]);
						$this.find("span.revslider_data_weather_alt_temp").text(get_alt_temp(weather_info["units"]["temperature"],weather_info["item"]["condition"]["temp"]));
						$this.find("span.revslider_data_weather_code").text(weather_info["item"]["condition"]["code"]);
						$this.find("span.revslider_data_weather_todayCode").text(weather_info["item"]["forecast"][0]["code"]);
						$this.find("span.revslider_data_weather_currently").text(weather_info["item"]["condition"]["text"]);
						$this.find("span.revslider_data_weather_high").text(weather_info["item"]["forecast"][0]["high"]);
						$this.find("span.revslider_data_weather_alt_high").text(get_alt_temp(weather_info["units"]["temperature"],weather_info["item"]["forecast"][0]["high"]));
						$this.find("span.revslider_data_weather_low").text(weather_info["item"]["forecast"][0]["low"]);
						$this.find("span.revslider_data_weather_alt_low").text(get_alt_temp(weather_info["units"]["temperature"],weather_info["item"]["forecast"][0]["low"]));
						$this.find("span.revslider_data_weather_text").text(weather_info["item"]["forecast"][0]["text"]);
						$this.find("span.revslider_data_weather_humidity").text(weather_info["atmosphere"]["humidity"]);
						$this.find("span.revslider_data_weather_pressure").text(weather_info["atmosphere"]["pressure"]);
						$this.find("span.revslider_data_weather_rising").text(weather_info["atmosphere"]["rising"]);
						$this.find("span.revslider_data_weather_visbility").text(weather_info["atmosphere"]["visibility"]);
						$this.find("span.revslider_data_weather_sunrise").text(weather_info["astronomy"]["sunrise"]);
						$this.find("span.revslider_data_weather_sunset").text(weather_info["astronomy"]["sunset"]);
						$this.find("span.revslider_data_weather_city").text(weather_info["location"]["city"]);
						$this.find("span.revslider_data_weather_country").text(weather_info["location"]["country"]);
						$this.find("span.revslider_data_weather_region").text(weather_info["location"]["region"]);
						$this.find("span.revslider_data_weather_updated").text(weather_info["item"]["pubDate"]);
						$this.find("span.revslider_data_weather_link").text(weather_info["link"]);
						$this.find("span.revslider_data_weather_thumbnail").text('https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/' + weather_info["item"]["condition"]["code"] + 'ds.png');
						$this.find("span.revslider_data_weather_image").text('https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/' + weather_info["item"]["condition"]["code"] + 'd.png');
						$this.find("span.revslider_data_weather_units_temp").text(weather_info["units"]["temperature"]);
						$this.find("span.revslider_data_weather_units_distance").text(weather_info["units"]["distance"]);
						$this.find("span.revslider_data_weather_units_pressure").text(weather_info["units"]["pressure"]);
						$this.find("span.revslider_data_weather_units_speed").text(weather_info["units"]["speed"]);
						$this.find("span.revslider_data_weather_wind_chill").text(weather_info["wind"]["chill"]);
						$this.find("span.revslider_data_weather_wind_direction").text(weather_info["wind"]["direction"]);
						$this.find("span.revslider_data_weather_wind_speed").text(weather_info["wind"]["speed"]);
						$this.find("span.revslider_data_weather_description").text(weather_info["description"]);
						$this.find("span.revslider_data_weather_icon").html('<i class=\"revslider-weather-icon revslider-weather-icon-' + weather_info["item"]["forecast"][0]["code"] + '\"></i>');
						
						for(var i=0;i<10;i++){
							$this.find("span.revslider_data_weather_date_forecast_"+i).text(weather_info["item"]["forecast"][i]["date"]);
							$this.find("span.revslider_data_weather_day_forecast_"+i).text(weather_info["item"]["forecast"][i]["day"]);
							$this.find("span.revslider_data_weather_code_forecast_"+i).text(weather_info["item"]["forecast"][i]["code"]);
							$this.find("span.revslider_data_weather_high_forecast_"+i).text(weather_info["item"]["forecast"][i]["high"]);
							$this.find("span.revslider_data_weather_low_forecast_"+i).text(weather_info["item"]["forecast"][i]["low"]);
							$this.find("span.revslider_data_weather_alt_high_forecast_"+i).text(get_alt_temp(weather_info["units"]["temperature"],weather_info["item"]["forecast"][i]["high"]));
							$this.find("span.revslider_data_weather_alt_low_forecast_"+i).text(get_alt_temp(weather_info["units"]["temperature"],weather_info["item"]["forecast"][i]["low"]));
							$this.find("span.revslider_data_weather_thumbnail_forecast_"+i).text('https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/' + weather_info["item"]["forecast"][i]["code"] + 'ds.png');
							$this.find("span.revslider_data_weather_image_forecast_"+i).text('https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/' + weather_info["item"]["forecast"][i]["code"] + 'd.png');
							$this.find("span.revslider_data_weather_icon_forecast_"+i).html('<i class=\"revslider-weather-icon revslider-weather-icon-' + weather_info["item"]["forecast"][i]["code"] + '\"></i>');
							$this.find("span.revslider_data_weather_text_forecast_"+i).text(weather_info["item"]["forecast"][i]["text"]);
						}
					}
				}
			);
		});
	}

	/**
	 * Get alternative temp unit data
	 * @since    1.0.0
	 */
	function get_alt_temp(unit, temp) {
	    if(unit === 'F') {
	      return fahrenheit_to_celsius(temp);
	    } 
	    else {
	      return celsius_to_fahrenheit(temp);
	    }
	}

	/**
	 * Convert Temp Fahrenheit to Celsius
	 * @since    1.0.0
	 */
	function fahrenheit_to_celsius(given_value)
    {
        var celsius=5/9*(given_value-32);
        return (celsius) ;
    }

    /**
	 * Convert Temp Celsius to Fahrenheit
	 * @since    1.0.0
	 */
    function celsius_to_fahrenheit(given_value)
    {
        var fahrenheit= given_value*9/5+32;
        return (fahrenheit);
    }

})( jQuery );
