/**
 * 	Ticker Class
 * 	Author: Averta Ltd
 */

;(function(){
	"use strict";
	
	averta.Ticker = function(){};
	
	var st = averta.Ticker,
		list = [],
		len = 0,
		__stopped = true;
	
	st.add = function (listener , ref){
		list.push([listener , ref]);
		
		if(list.length === 1) st.start();
		len = list.length;
		return len;
	};
	
	st.remove = function (listener , ref) {
		for(var i = 0 , l = list.length ; i<l ; ++i){
			if(list[i] && list[i][0] === listener && list[i][1] === ref){
				list.splice(i , 1);
			}
		}

		len = list.length;

		if( len === 0 ){
			st.stop();
		}
	};
	
	st.start = function (){
		if(!__stopped) return;
		__stopped = false;
		__tick();
	};
	
	st.stop = function (){
		__stopped = true;
	};
	
	var __tick = function () {
		if(st.__stopped) return;
		var item;
		for(var i = 0; i!==len; i++){
			item = list[i];
			item[0].call(item[1]);
		}

		requestAnimationFrame(__tick);
	};
	
})();

/**
 * 	Timer Class
 * 	Author: Averta Ltd
 */
;(function(){
	"use strict";
	
	if(!Date.now){
		Date.now = function(){
			return new Date().getTime();
		};
	}
	
	averta.Timer = function(delay , autoStart) {
		this.delay = delay;
		this.currentCount = 0;
		this.paused = false;
		this.onTimer = null;
		this.refrence = null;
		
		if(autoStart) this.start();
		
	};
	
	averta.Timer.prototype = {
		
		constructor : averta.Timer,
		
		start : function(){
			this.paused = false;
			this.lastTime = Date.now();
			averta.Ticker.add(this.update , this);
		},
		
		stop : function(){
			this.paused = true;
			averta.Ticker.remove(this.update , this);
		},
		
		reset : function(){
			this.currentCount = 0;
			this.paused = true;
			this.lastTime = Date.now();
		},
		
		update : function(){
			if(this.paused || Date.now() - this.lastTime < this.delay) return;
			this.currentCount ++;
			this.lastTime = Date.now();
			if(this.onTimer)
				this.onTimer.call(this.refrence , this.getTime());

		} ,
		
		getTime : function(){
			return this.delay * this.currentCount;
		}
		
	};
})();
