;(function(){
	
	"use strict";
	
	averta.EventDispatcher = function(){
		this.listeners = {};
	};
	
	averta.EventDispatcher.extend = function(_proto){
		var instance = new averta.EventDispatcher();
		for(var key in instance)
			if(key != 'constructor') _proto[key] =  averta.EventDispatcher.prototype[key];
	};
	
	averta.EventDispatcher.prototype = {
		
		constructor : averta.EventDispatcher,
		
		addEventListener : function(event , listener , ref){
			if(!this.listeners[event]) this.listeners[event] = [];
			this.listeners[event].push({listener:listener , ref:ref});
			
		},
		
		removeEventListener : function(event , listener , ref){
			if(this.listeners[event]){

				for(var i = 0; i < this.listeners[event].length ; ++i){
					
					if(listener === this.listeners[event][i].listener && ref === this.listeners[event][i].ref){	
						this.listeners[event].splice(i--,1);
					}
				}
				
				if (this.listeners[event].length === 0){
					this.listeners[event] = null;
				}
			}
		},
		
		dispatchEvent : function (event) {
			event.target = this;
			if(this.listeners[event.type]){
				for(var i = 0 , l = this.listeners[event.type].length; i < l ; ++i){
					this.listeners[event.type][i].listener.call(this.listeners[event.type][i].ref , event);	
				}
			}
		}
	};

})();
