<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://www.themepunch.com
 * @since      1.0.0
 *
 * @package    Revslider_Weather_Addon
 * @subpackage Revslider_Weather_Addon/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Revslider_Weather_Addon
 * @subpackage Revslider_Weather_Addon/public
 * @author     ThemePunch <info@themepunch.com>
 */
class Revslider_Weather_Addon_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	private $weather;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Revslider_Weather_Addon_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Revslider_Weather_Addon_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		//wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/revslider-weather-addon-public.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Revslider_Weather_Addon_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Revslider_Weather_Addon_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		

	}

	/**
	 * Get Information from Slide and call the weather
	 * @since    1.0.0
	 */
	public function revslider_add_layer_html($slider, $slide){
		//global $revslider_weather;

		$sliderParams = $slider->getParams();

		if( isset($sliderParams["revslider-weather-enabled"]) && $sliderParams["revslider-weather-enabled"] == "true" ){
			wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/revslider-weather-addon-public.css', array(), $this->version, 'all' );
		}

		if( isset($sliderParams["revslider-weather-enabled"]) && $sliderParams["revslider-weather-enabled"] == "true"  && !empty( $sliderParams["revslider-weather-refresh"] ) ){
			wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/revslider-weather-addon-public.js', array( 'jquery' ), $this->version, false );
			wp_localize_script( $this->plugin_name, 'rev_slider_weather_addon', array(
					'ajax_url' => admin_url( 'admin-ajax.php' ),
					'interval' => $sliderParams["revslider-weather-refresh"]
				));
		}

		
	}


	/**
	 * Connects to Yahoo API and collects Weather Info
	 * @since    1.0.0
	 */
	public function get_weather($type,$woeid,$name,$unit){
		
		//Get weather information dependent from Slider options
		$revslider_weather = RevAddOnWeatherYahoo::get_weather_infos($type,$woeid,$name,$unit);
		return $revslider_weather;

	}

	/**
	 * Filters the custom meta placeholders and calls function to replace
	 * @since    1.0.0
	 */
	public function rev_addon_insert_meta($record){

		$params = json_decode($record["params"]);
		
		$type = isset($params->{"revslider-weather-location-type"}) ? $params->{"revslider-weather-location-type"} : '';
		$woeid = isset($params->{"revslider-weather-location-woeid"}) ? $params->{"revslider-weather-location-woeid"} : '';
		$name = isset($params->{"revslider-weather-location-name"}) ? $params->{"revslider-weather-location-name"} : '';
		$unit = isset($params->{"revslider-weather-unit"}) ? $params->{"revslider-weather-unit"} : '';
		$params->params_10 = (!isset($params->params_10)) ? '' : $params->params_10;
		
		//Get weather information dependent from Slider options
		$revslider_weather = $this->get_weather($type,$woeid,$name,$unit);
		// $revslider_weather = '';
		
		
		$params->params_10_chars = 1200;
		$params->params_10 = $params->params_10 . '{"revslider-weather-addon" : { "type" : "' . $type . '" ,"name" : "' . $name . '" ,"woeid" : "' . $woeid . '" ,"unit" : "' . $unit . '" }}';

		$record["params"] = json_encode($params);

		if(strpos($record["layers"], "%weather_icon%")) wp_enqueue_style( $this->plugin_name . '_icons', plugin_dir_url( __FILE__ ) . 'css/revslider-weather-addon-icon.css', array(), $this->version, 'all' );
		
		// if(!isset($revslider_weather->query->results->channel)) return $record;
		
		$def_value = '--';
		$def_fc = 'F';
		$def_icon = '30';
		$results = false;
		
		if(!empty($revslider_weather) && isset($revslider_weather->query) && isset($revslider_weather->query->results) && isset($revslider_weather->query->results->channel)) {
			
			$results = true;
			$values = array(
				'revslider_data_weather_title' => $revslider_weather->query->results->channel->item->title,
				'revslider_data_weather_temp' => $revslider_weather->query->results->channel->item->condition->temp,
				'revslider_data_weather_code' => $revslider_weather->query->results->channel->item->condition->code,
				'revslider_data_weather_todayCode' => $revslider_weather->query->results->channel->item->forecast[0]->code,
				'revslider_data_weather_date' => $revslider_weather->query->results->channel->item->forecast[0]->date,
				'revslider_data_weather_day' => $revslider_weather->query->results->channel->item->forecast[0]->day,
				'revslider_data_weather_currently' => RevAddOnWeatherYahoo::condition_lang($revslider_weather->query->results->channel->item->condition->text),
				'revslider_data_weather_high' => $revslider_weather->query->results->channel->item->forecast[0]->high,
				'revslider_data_weather_low' => $revslider_weather->query->results->channel->item->forecast[0]->low,
				'revslider_data_weather_text' => RevAddOnWeatherYahoo::condition_lang($revslider_weather->query->results->channel->item->forecast[0]->text),
				'revslider_data_weather_humidity' => $revslider_weather->query->results->channel->atmosphere->humidity,
				'revslider_data_weather_pressure' => $revslider_weather->query->results->channel->atmosphere->pressure,
				'revslider_data_weather_rising' => $revslider_weather->query->results->channel->atmosphere->rising,
				'revslider_data_weather_visbility' => $revslider_weather->query->results->channel->atmosphere->visibility,
				'revslider_data_weather_sunrise' => $revslider_weather->query->results->channel->astronomy->sunrise,
				'revslider_data_weather_sunset' => $revslider_weather->query->results->channel->astronomy->sunset,
				'revslider_data_weather_city' => $revslider_weather->query->results->channel->location->city,
				'revslider_data_weather_country' => $revslider_weather->query->results->channel->location->country,
				'revslider_data_weather_region' => $revslider_weather->query->results->channel->location->region,
				'revslider_data_weather_updated' => $revslider_weather->query->results->channel->item->pubDate,
				'revslider_data_weather_link' => $revslider_weather->query->results->channel->item->link,
				'revslider_data_weather_thumbnail' => $revslider_weather->query->results->channel->item->forecast[0]->code . 'ds.png',
				'revslider_data_weather_image' => $revslider_weather->query->results->channel->item->forecast[0]->code . 'd.png',
				'revslider_data_weather_units_temp' => $revslider_weather->query->results->channel->units->temperature,
				'revslider_data_weather_units_distance' => $revslider_weather->query->results->channel->units->distance,
				'revslider_data_weather_units_pressure' => $revslider_weather->query->results->channel->units->pressure,
				'revslider_data_weather_units_speed' => $revslider_weather->query->results->channel->units->speed,
				'revslider_data_weather_wind_chill' => $revslider_weather->query->results->channel->wind->chill,
				'revslider_data_weather_wind_direction' => $revslider_weather->query->results->channel->wind->direction,
				'revslider_data_weather_wind_speed' => $revslider_weather->query->results->channel->wind->speed,
				'revslider_data_weather_alt_temp' => $this->get_alt_temp($revslider_weather->query->results->channel->units->temperature,$revslider_weather->query->results->channel->item->condition->temp),
				'revslider_data_weather_alt_high' => $this->get_alt_temp($revslider_weather->query->results->channel->units->temperature,$revslider_weather->query->results->channel->item->forecast[0]->high),
				'revslider_data_weather_alt_low' => $this->get_alt_temp($revslider_weather->query->results->channel->units->temperature,$revslider_weather->query->results->channel->item->forecast[0]->low),
				'revslider_data_weather_alt_unit' => $revslider_weather->query->results->channel->units->temperature == "F" ? "C" : "F",
				'revslider_data_weather_description' => $revslider_weather->query->results->channel->item->description,
				'revslider_data_weather_icon' => $revslider_weather->query->results->channel->item->forecast[0]->code
			);
			
		}
		else {
			
			$values = array(
				'revslider_data_weather_title' => $def_value,
				'revslider_data_weather_temp' => $def_value,
				'revslider_data_weather_code' => $def_value,
				'revslider_data_weather_todayCode' => $def_value,
				'revslider_data_weather_date' => $def_value,
				'revslider_data_weather_day' => $def_value,
				'revslider_data_weather_currently' => $def_value,
				'revslider_data_weather_high' => $def_value,
				'revslider_data_weather_low' => $def_value,
				'revslider_data_weather_text' => $def_value,
				'revslider_data_weather_humidity' => $def_value,
				'revslider_data_weather_pressure' => $def_value,
				'revslider_data_weather_rising' => $def_value,
				'revslider_data_weather_visbility' => $def_value,
				'revslider_data_weather_sunrise' => $def_value,
				'revslider_data_weather_sunset' => $def_value,
				'revslider_data_weather_city' => $def_value,
				'revslider_data_weather_country' => $def_value,
				'revslider_data_weather_region' => $def_value,
				'revslider_data_weather_updated' => $def_value,
				'revslider_data_weather_link' => $def_value,
				'revslider_data_weather_thumbnail' => $def_value,
				'revslider_data_weather_image' => $def_value,
				'revslider_data_weather_units_temp' => $def_value,
				'revslider_data_weather_units_distance' => $def_value,
				'revslider_data_weather_units_pressure' => $def_value,
				'revslider_data_weather_units_speed' => $def_value,
				'revslider_data_weather_wind_chill' => $def_value,
				'revslider_data_weather_wind_direction' => $def_value,
				'revslider_data_weather_wind_speed' => $def_value,
				'revslider_data_weather_alt_temp' => $def_value,
				'revslider_data_weather_alt_high' => $def_value,
				'revslider_data_weather_alt_low' => $def_value,
				'revslider_data_weather_alt_unit' => $def_fc,
				'revslider_data_weather_description' => $def_value,
				'revslider_data_weather_icon' => $def_icon
			);
		}
		
		//Replace Placeholders on Slide Layers
		$record["layers"] = str_replace( 
			array(
				"%weather_title%",
				"%weather_temp%",
				"%weather_code%",
				"%weather_todayCode%",
				"%weather_date%",
				"%weather_day%",
				"%weather_currently%",
				"%weather_high%",
				"%weather_low%",
				"%weather_text%",
				"%weather_humidity%",
				"%weather_pressure%",
				"%weather_rising%",
				"%weather_visbility%",
				"%weather_sunrise%",
				"%weather_sunset%",
				"%weather_city%",
				"%weather_country%",
				"%weather_region%",
				"%weather_updated%",
				"%weather_link%",
				"%weather_thumbnail%",
				"%weather_image%",
				"%weather_units_temp%",
				"%weather_units_distance%",
				"%weather_units_pressure%",
				"%weather_units_speed%",
				"%weather_wind_chill%",
				"%weather_wind_direction%",
				"%weather_wind_speed%",
				"%weather_alt_temp%",
				"%weather_alt_high%",
				"%weather_alt_low%",
				"%weather_alt_unit%",
				"%weather_description%",
				"%weather_icon%"
			), 
			array(
				'<span class=\"revslider-weather-data revslider_data_weather_title\">' . $values['revslider_data_weather_title'] . '</span>',
				'<span class=\"revslider-weather-data revslider_data_weather_temp\">' . $values['revslider_data_weather_temp'] . '</span>',
				'<span class=\"revslider-weather-data revslider_data_weather_code\">' . $values['revslider_data_weather_code'] . '</span>',
				'<span class=\"revslider-weather-data revslider_data_weather_todayCode\">' . $values['revslider_data_weather_todayCode'] . '</span>',
				'<span class=\"revslider-weather-data revslider_data_weather_date\">' . $values['revslider_data_weather_date'] . '</span>',
				'<span class=\"revslider-weather-data revslider_data_weather_day\">' . $values['revslider_data_weather_day'] . '</span>',
				'<span class=\"revslider-weather-data revslider_data_weather_currently\">' . $values['revslider_data_weather_currently'] . '</span>',
				'<span class=\"revslider-weather-data revslider_data_weather_high\">' . $values['revslider_data_weather_high'] . '</span>',
				'<span class=\"revslider-weather-data revslider_data_weather_low\">' . $values['revslider_data_weather_low'] . '</span>',
				'<span class=\"revslider-weather-data revslider_data_weather_text\">' . $values['revslider_data_weather_text'] . '</span>',
				'<span class=\"revslider-weather-data revslider_data_weather_humidity\">' . $values['revslider_data_weather_humidity'] . '</span>',
				'<span class=\"revslider-weather-data revslider_data_weather_pressure\">' . $values['revslider_data_weather_pressure'] . '</span>',
				'<span class=\"revslider-weather-data revslider_data_weather_rising\">' . $values['revslider_data_weather_rising'] . '</span>',
				'<span class=\"revslider-weather-data revslider_data_weather_visbility\">' . $values['revslider_data_weather_visbility'] . '</span>',
				'<span class=\"revslider-weather-data revslider_data_weather_sunrise\">' . $values['revslider_data_weather_sunrise'] . '</span>',
				'<span class=\"revslider-weather-data revslider_data_weather_sunset\">' . $values['revslider_data_weather_sunset'] . '</span>',
				'<span class=\"revslider-weather-data revslider_data_weather_city\">' . $values['revslider_data_weather_city'] . '</span>',
				'<span class=\"revslider-weather-data revslider_data_weather_country\">' . $values['revslider_data_weather_country'] . '</span>',
				'<span class=\"revslider-weather-data revslider_data_weather_region\">' . $values['revslider_data_weather_region'] . '</span>',
				'<span class=\"revslider-weather-data revslider_data_weather_updated\">' . $values['revslider_data_weather_updated'] . '</span>',
				'<span class=\"revslider-weather-data revslider_data_weather_link\">' . $values['revslider_data_weather_link'] . '</span>',
				'<span class=\"revslider-weather-data revslider_data_weather_thumbnail\">' . $values['revslider_data_weather_thumbnail'] . '</span>',
				'<span class=\"revslider-weather-data revslider_data_weather_image\">' . $values['revslider_data_weather_image'] . '</span>',
				'<span class=\"revslider-weather-data revslider_data_weather_units_temp\">' . $values['revslider_data_weather_units_temp'] . '</span>',
				'<span class=\"revslider-weather-data revslider_data_weather_units_distance\">' . $values['revslider_data_weather_units_distance'] . '</span>',
				'<span class=\"revslider-weather-data revslider_data_weather_units_pressure\">' . $values['revslider_data_weather_units_pressure'] . '</span>',
				'<span class=\"revslider-weather-data revslider_data_weather_units_speed\">' . $values['revslider_data_weather_units_speed'] . '</span>',
				'<span class=\"revslider-weather-data revslider_data_weather_wind_chill\">' . $values['revslider_data_weather_wind_chill'] . '</span>',
				'<span class=\"revslider-weather-data revslider_data_weather_wind_direction\">' . $values['revslider_data_weather_wind_direction'] . '</span>',
				'<span class=\"revslider-weather-data revslider_data_weather_wind_speed\">' . $values['revslider_data_weather_wind_speed'] . '</span>',
				'<span class=\"revslider-weather-data revslider_data_weather_alt_temp\">' . $values['revslider_data_weather_alt_temp'] . '</span>',
				'<span class=\"revslider-weather-data revslider_data_weather_alt_high\">' . $values['revslider_data_weather_alt_high'] . '</span>',
				'<span class=\"revslider-weather-data revslider_data_weather_alt_low\">' . $values['revslider_data_weather_alt_low'] . '</span>',
				'<span class=\"revslider-weather-data revslider_data_weather_alt_unit\">' . $values['revslider_data_weather_alt_unit']. '</span>',
				'<span class=\"revslider-weather-data revslider_data_weather_description\">' . $values['revslider_data_weather_description'] . '</span>',
				'<span class=\"revslider-weather-data revslider_data_weather_icon\"><i class=\"revslider-weather-icon revslider-weather-icon-' . $values['revslider_data_weather_icon'] . '\"></i>' . '</span>'
			),
			$record["layers"]);

			//Check for forecasts
			$forecasts = preg_match_all('/\\%weather_.*?_forecast:[0-9]\\%/', $record["layers"], $matches);
			
			if($forecasts){
				
				foreach ($matches as $forecast_array) {
					if(is_array($forecast_array)){
						foreach ($forecast_array as $forecast) {
							$orig_forecast = $forecast;
							$forecast = str_replace(array("%","_forecast","weather_"), "", $forecast);
							$forecast = explode(":", $forecast);
							$what = $forecast[0];
							$when = $forecast[1];
							if(strpos($what, "alt_") !== false){
								
								$what = str_replace("alt_", "", $what);
								
								$temp = $results ? $revslider_weather->query->results->channel->item->forecast[$when]->$what : $def_value;
								$what = $what == "text" ? RevAddOnWeatherYahoo::condition_lang($temp) : $temp;
								
								$fc = $results ? $revslider_weather->query->results->channel->units->temperature : $def_fc;
								$record["layers"] = str_replace( $orig_forecast , $this->get_alt_temp( $def_fc , $what ) , $record["layers"] );
								
							}
							else{
								$what_orig = $what;
								switch($what) {
									case 'image':
										$temp = $results ? $revslider_weather->query->results->channel->item->forecast[$when]->code : $def_value;
										$what = 'https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/'. $temp . 'd.png';
										break;
									case 'thumbnail':
										$temp = $results ? $revslider_weather->query->results->channel->item->forecast[$when]->code : $def_value;
										$what = 'https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/'. $temp . 'ds.png';
										break;
									case 'icon':
										$temp = $results ? $revslider_weather->query->results->channel->item->forecast[$when]->code : $def_icon;
										$what = '<i class=\"revslider-weather-icon revslider-weather-icon-' . $temp . '\"></i>';
										break;
									case 'text':
										$temp = $results ? $revslider_weather->query->results->channel->item->forecast[$when]->$what : $def_value;
										$what = RevAddOnWeatherYahoo::condition_lang($revslider_weather->query->results->channel->item->forecast[$when]->$what);
										break;	
									default:
										$what = $results ? $revslider_weather->query->results->channel->item->forecast[$when]->$what : $def_value;
								}

								$what = '<span class=\"revslider-weather-data revslider_weather_'.$what_orig.'_forecast_'.$when.'\">' . $what . '</span>';

								$record["layers"] = str_replace($orig_forecast, $what , $record["layers"]);
							}
						}					
					}
				}
			}

		return $record;
	}

	/**
	 * Get alternative temp unit data
	 * @since    1.0.0
	 */
	public function get_alt_temp($unit, $temp) {
	    if($unit === 'F') {
	      return $this->fahrenheit_to_celsius($temp);
	    } 
	    else {
	      return $this->celsius_to_fahrenheit($temp);
	    }
	}

	/**
	 * Convert Temp Fahrenheit to Celsius
	 * @since    1.0.0
	 */
	public function fahrenheit_to_celsius($given_value)
    {
        $celsius=5/9*($given_value-32);
        return $celsius ;
    }

    /**
	 * Convert Temp Celsius to Fahrenheit
	 * @since    1.0.0
	 */
    public function celsius_to_fahrenheit($given_value)
    {
        $fahrenheit=$given_value*9/5+32;
        return $fahrenheit ;
    }

    /**
	 * Ajax Function for refreshing on screen weather data dynamically
	 * @since    1.0.0
	 */
	public function revslider_weather_addon_refresh(){
		$weather_data = $_POST["weather"]["revslider-weather-addon"];
		$weather_data["type"] = sanitize_title( $weather_data["type"] );
		$weather_data["name"] = sanitize_title( $weather_data["name"] );
		$weather_data["unit"] = sanitize_title( $weather_data["unit"] );
		$weather_data["woeid"] = intval( $weather_data["woeid"] );
		
		$revslider_weather = $this->get_weather( $weather_data["type"] , $weather_data["woeid"] , $weather_data["name"] , $weather_data["unit"] );

		echo json_encode($revslider_weather);
	}

}
