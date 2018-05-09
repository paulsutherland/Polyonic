window.MSSliderEvent = function (type){
	this.type = type;
};

MSSliderEvent.CHANGE_START      	= 'ms_changestart';
MSSliderEvent.CHANGE_END       		= 'ms_changeend';
MSSliderEvent.WAITING		      	= 'ms_waiting';
MSSliderEvent.AUTOPLAY_CHANGE   	= 'ms_autoplaychange';
MSSliderEvent.VIDEO_PLAY		   	= 'ms_videoPlay';
MSSliderEvent.VIDEO_CLOSE		   	= 'ms_videoclose';
MSSliderEvent.INIT					= 'ms_init';
MSSliderEvent.HARD_UPDATE			= 'ms_hard_update';
MSSliderEvent.RESIZE				= 'ms_resize';
MSSliderEvent.RESERVED_SPACE_CHANGE = 'ms_rsc'; // internal use
MSSliderEvent.DESTROY				= 'ms_destroy';