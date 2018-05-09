;(function($){
	
	window.MSLayerEffects = {};
	
	var installed,
		_fade = {opacity:0};
		
	MSLayerEffects.setup = function(){
		
		if(installed) return;
		installed = true;
		
		var st 					= MSLayerEffects,
			transform_css 		= window._jcsspfx + 'Transform',
			transform_orig_css  = window._jcsspfx + 'TransformOrigin',
			o					= $.browser.opera; // Opera sucks :|
			_2d					= window._css2d && window._cssanim && !o;
		
		st.defaultValues = {left : 0 , top: 0 , opacity:(isMSIE('<=9')?1:'') , right:0 , bottom:0};
		st.defaultValues[transform_css] 	 = '';
		//st.defaultValues[transform_orig_css] = '';
		st.rf = 1;
		
		st.presetEffParams = {
			random: '30|300',
			long 	: 300,
			short	: 30,
			'false'	:false,
			'true'	:true,
			tl	 : 'top left'	,	bl: 'bottom left',
			tr   : 'top right'	,   br: 'bottom right', 
			rt   : 'top right'	,	lb: 'bottom left',
			lt   : 'top left'	,	rb: 'bottom right',
			t	 : 'top'		,	b : 'bottom',
			r	 : 'right'		,	l : 'left',
			c	 : 'center'	
		};
		
		
		/*
		 ----------------------------------------
		 				2D Effects
		 ----------------------------------------
		 */
		
		st.fade = function(){
			return _fade;
		};
	
		st.left = (_2d)? function(dist , fade){
			var r = fade === false ? {} : {opacity:0};
			r[transform_css] = 'translateX(' + -dist*st.rf + 'px)';
			return r;
		} : function (dist, fade){
			var r = fade === false ? {} : {opacity:0};
			r.left = -dist*st.rf + 'px';
			return r;
		};
		
		st.right = (_2d)? function(dist , fade){
			var r = fade === false ? {} : {opacity:0};
			r[transform_css] = 'translateX(' + dist*st.rf + 'px)';
			return r;
		} : function (dist, fade){
			var r = fade === false ? {} : {opacity:0};
			r.left = dist*st.rf + 'px';
			return r;
		};
		
		st.top = (_2d)? function(dist , fade){
			var r = fade === false ? {} : {opacity:0};
			r[transform_css] = 'translateY(' + -dist*st.rf + 'px)';
			return r;
		} : function (dist, fade){
			var r = fade === false ? {} : {opacity:0};
			r.top = -dist*st.rf + 'px';
			return r;
		};
		
		st.bottom = (_2d)? function(dist , fade){
			var r = fade === false ? {} : {opacity:0};
			r[transform_css] = 'translateY(' + dist*st.rf + 'px)';
			return r;
		} : function (dist, fade){
			var r = fade === false ? {} : {opacity:0};
			r.top = dist*st.rf + 'px';
			return r;
		};
		
		st.from = (_2d)? function(leftdis , topdis , fade){
			var r = fade === false ? {} : {opacity:0};
			r[transform_css] = 'translateX('+leftdis*st.rf+'px) translateY(' + topdis*st.rf + 'px)';
			return r;
		} : function (leftdis , topdis, fade){
			var r = fade === false ? {} : {opacity:0};
			r.top = topdis*st.rf + 'px';
			r.left = leftdis*st.rf + 'px';
			return r;
		};
		
		
		// --------------------------------------------------------------------
		
		st.rotate = (_2d)? function(deg , orig ){
			var r = {opacity: 0};
			r[transform_css] = ' rotate('+deg+'deg)';
			if(orig) r[transform_orig_css] = orig;
			return r;
		} : function (deg, orig){
			return _fade;
		};
		
		st.rotateleft = (_2d)? function(deg , dist , orig , fade){
			var r = st.left(dist , fade);
			r[transform_css] += ' rotate('+deg+'deg)';
			if(orig) r[transform_orig_css] = orig;
			return r;
		} : function (deg , dist , orig , fade){
			return st.left(dist , fade);
		};
		
		st.rotateright = (_2d)? function(deg , dist , orig , fade){
			var r = st.right(dist , fade);
			r[transform_css] += ' rotate('+deg+'deg)';
			if(orig) r[transform_orig_css] = orig;
			return r;
		} : function (deg , dist , orig , fade){
			return st.right(dist , fade);
		};
		
		st.rotatetop = (_2d)? function(deg , dist , orig , fade){
			var r = st.top(dist , fade);
			r[transform_css] += ' rotate('+deg+'deg)';
			if(orig) r[transform_orig_css] = orig;
			return r;
		} : function (deg , dist , orig , fade){
			return st.top(dist , fade);
		};
		
		st.rotatebottom = (_2d)? function(deg , dist , orig , fade){
			var r = st.bottom(dist , fade);
			r[transform_css] += ' rotate('+deg+'deg)';
			if(orig) r[transform_orig_css] = orig;
			return r;
		} : function (deg , dist , orig , fade){
			return st.bottom(dist , fade);
		};
			
		st.rotatefrom = (_2d)? function(deg , leftdis , topdis , orig , fade){
			var r = st.from(leftdis , topdis , fade);
			r[transform_css] += ' rotate('+deg+'deg)';
			if(orig) r[transform_orig_css] = orig;
			return r;
		} : function (deg , leftdis , topdis , orig , fade){
			return st.from(leftdis , topdis , fade);
		};
			
		st.skewleft = (_2d)? function(deg , dist , fade){
			var r = st.left(dist , fade);
			r[transform_css] += ' skewX(' + deg + 'deg)';
			return r;
		} : function (deg , dist , fade){
			return st.left(dist , fade);
		};	
		
		st.skewright = (_2d)? function(deg , dist , fade){
			var r = st.right(dist , fade);
			r[transform_css] += ' skewX(' + -deg + 'deg)';
			return r;
		} : function (deg , dist , fade){
			return st.right(dist , fade);
		};	
		
		st.skewtop = (_2d)? function(deg , dist , fade){
			var r = st.top(dist , fade);
			r[transform_css] += ' skewY(' + deg + 'deg)';
			return r;
		} : function (deg , dist , fade){
			return st.top(dist , fade);
		};	
		
		st.skewbottom = (_2d)? function(deg , dist , fade){
			var r = st.bottom(dist , fade);
			r[transform_css] += ' skewY(' + -deg + 'deg)';
			return r;
		} : function (deg , dist , fade){
			return st.bottom(dist , fade);
		};	
		
		
		st.scale = (_2d)? function(x , y , orig , fade){
			var r = fade === false ? {} : {opacity:0};
			r[transform_css] = ' scaleX('+x+') scaleY('+y+')';
			if(orig) r[transform_orig_css] = orig;
			return r;
		} : function (x , y , orig , fade){
			return fade === false ? {} : {opacity:0};
		};
		
		st.scaleleft = (_2d)? function(x , y  , dist , orig , fade){
			var r = st.left(dist , fade);
			r[transform_css] = ' scaleX('+x+') scaleY('+y+')';
			if(orig) r[transform_orig_css] = orig;
			return r;
		} : function (x , y  , dist , orig , fade){
			return st.left(dist , fade);
		};
		
		st.scaleright = (_2d)? function(x , y  , dist , orig , fade){
			var r = st.right(dist , fade);
			r[transform_css] = ' scaleX('+x+') scaleY('+y+')';
			if(orig) r[transform_orig_css] = orig;
			return r;
		} : function (x , y  , dist , orig , fade){
			return st.right(dist , fade);
		};
		
		st.scaletop = (_2d)? function(x , y  , dist , orig , fade){
			var r = st.top(dist , fade);
			r[transform_css] = ' scaleX('+x+') scaleY('+y+')';
			if(orig) r[transform_orig_css] = orig;
			return r;
		} : function (x , y  , dist , orig , fade){
			return st.top(dist , fade);
		};
		
		st.scalebottom = (_2d)? function(x , y  , dist , orig , fade){
			var r = st.bottom(dist , fade);
			r[transform_css] = ' scaleX('+x+') scaleY('+y+')';
			if(orig) r[transform_orig_css] = orig;
			return r;
		} : function (x , y  , dist , orig , fade){
			return st.bottom(dist , fade);
		};
			
		st.scalefrom = (_2d)? function(x , y  , leftdis , topdis , orig , fade){
			var r = st.from(leftdis , topdis , fade);
			r[transform_css] += ' scaleX('+x+') scaleY('+y+')';
			if(orig) r[transform_orig_css] = orig;
			return r;
		} : function (x , y  , leftdis , topdis , orig , fade){
			return st.from(leftdis , topdis , fade);
		};
		
		st.rotatescale = (_2d)? function(deg , x , y  ,  orig , fade){
			var r = st.scale(x , y , orig , fade);
			r[transform_css] += ' rotate('+deg+'deg)';
			if(orig) r[transform_orig_css] = orig;
			return r;
		} : function (deg , x , y  ,  orig , fade){
			return st.scale(x , y , orig , fade);
		};
		
		
		/*
		 ----------------------------------------
		 				3D Effects
		 ----------------------------------------
		 */
		
		st.front = (window._css3d)? function(dist , fade){
			var r = fade === false ? {} : {opacity:0};
			r[transform_css] = 'perspective(2000px) translate3d(0 , 0 ,' + dist + 'px ) rotate(0.001deg)';
			return r;
		} : function (dist){
			return _fade;
		};
		
		st.back = (window._css3d)? function(dist, fade){
			var r = fade === false ? {} : {opacity:0};
			r[transform_css] = 'perspective(2000px) translate3d(0 , 0 ,' + -dist + 'px ) rotate(0.001deg)';
			return r;
		} : function (dist){
			return _fade;
		};
		
		st.rotatefront = (window._css3d)? function(deg , dist , orig , fade ){
			var r = fade === false ? {} : {opacity:0};
			r[transform_css] = 'perspective(2000px) translate3d(0 , 0 ,' + dist + 'px ) rotate('+ (deg || 0.001) +'deg)';
			if(orig) r[transform_orig_css] = orig;
			return r;
		} : function (deg , dist , orig , fade ){
			return _fade;
		};
		
		st.rotateback = (window._css3d)? function(deg , dist , orig , fade ){
			var r = fade === false ? {} : {opacity:0};
			r[transform_css] = 'perspective(2000px) translate3d(0 , 0 ,' + -dist + 'px ) rotate('+ (deg || 0.001) +'deg)';
			if(orig) r[transform_orig_css] = orig;
			return r;
		} : function (deg , dist , orig , fade ){
			return _fade;
		};
						
		st.rotate3dleft = (window._css3d)? function(x , y , z , dist , orig , fade){
			var r = st.left(dist , fade);
			r[transform_css] += (x?' rotateX('+x+'deg)' : ' ')+(y?' rotateY('+y+'deg)' : '')+(z?' rotateZ('+z+'deg)' : '');
			if(orig) r[transform_orig_css] = orig;
			return r;		
			
		} : function (x , y , z , dist , orig , fade){
			return st.left(dist , fade);;
		};
		
		st.rotate3dright = (window._css3d)? function(x , y , z , dist , orig , fade){
			var r = st.right(dist , fade);
			r[transform_css] += (x?' rotateX('+x+'deg)' : ' ')+(y?' rotateY('+y+'deg)' : '')+(z?' rotateZ('+z+'deg)' : '');
			if(orig) r[transform_orig_css] = orig;
			return r;		
		} : function (x , y , z , dist , orig , fade){
			return st.right(dist , fade);;
		};
		
		st.rotate3dtop = (window._css3d)? function(x , y , z , dist , orig , fade){
			var r = st.top(dist , fade);
			r[transform_css] += (x?' rotateX('+x+'deg)' : ' ')+(y?' rotateY('+y+'deg)' : '')+(z?' rotateZ('+z+'deg)' : '');
			if(orig) r[transform_orig_css] = orig;
			return r;		
		} : function (x , y , z , dist , orig , fade){
			return st.top(dist , fade);;
		};
		
		st.rotate3dbottom = (window._css3d)? function(x , y , z , dist , orig , fade){
			var r = st.bottom(dist , fade);
			r[transform_css] += (x?' rotateX('+x+'deg)' : ' ')+(y?' rotateY('+y+'deg)' : '')+(z?' rotateZ('+z+'deg)' : '');
			if(orig) r[transform_orig_css] = orig;
			return r;		
		} : function (x , y , z , dist , orig , fade){
			return st.bottom(dist , fade);
		};
		
		st.rotate3dfront = (window._css3d)? function(x , y , z , dist , orig , fade){
			var r = st.front(dist , fade);
			r[transform_css] += (x?' rotateX('+x+'deg)' : ' ')+(y?' rotateY('+y+'deg)' : '')+(z?' rotateZ('+z+'deg)' : '');
			if(orig) r[transform_orig_css] = orig;
			return r;		
		} : function (x , y , z , dist , orig , fade){
			return st.front(dist , fade);
		};		
		
		st.rotate3dback = (window._css3d)? function(x , y , z , dist , orig , fade){
			var r = st.back(dist , fade);
			r[transform_css] += (x?' rotateX('+x+'deg)' : ' ')+(y?' rotateY('+y+'deg)' : '')+(z?' rotateZ('+z+'deg)' : '');
			if(orig) r[transform_orig_css] = orig;
			return r;		
		} : function (x , y , z , dist , orig , fade){
			return st.back(dist , fade);
		};

		// transform effect
		st.t = (window._css3d)? function(fade,tx,ty,tz,r,rx,ry,rz,scx,scy,skx,sky,ox,oy,oz){
			var _r = fade === false ? {} : {opacity:0};
			var transform = 'perspective(2000px) ';

			tx  !== 'n' && (transform += 'translateX(' + tx * st.rf + 'px) ');
			ty  !== 'n' && (transform += 'translateY(' + ty * st.rf + 'px) ');
			tz  !== 'n' && (transform += 'translateZ(' + tz * st.rf + 'px) ');
			r   !== 'n' && (transform += 'rotate(' + r + 'deg) ');
			rx  !== 'n' && (transform += 'rotateX(' + rx + 'deg) ');
			ry  !== 'n' && (transform += 'rotateY(' + ry + 'deg) ');
			rz  !== 'n' && (transform += 'rotateZ(' + rz + 'deg) ');
			skx !== 'n' && (transform += 'skewX(' + skx + 'deg) ');
			sky !== 'n' && (transform += 'skewY(' + sky + 'deg) ');
			scx !== 'n' && (transform += 'scaleX(' + scx + ') ');
			scy !== 'n' && (transform += 'scaleY(' + scy + ')');

			_r[transform_css] = transform;

			var trans_origin = '';

			trans_origin += (ox !== 'n' ? ox + '% ' : '50% '); 
			trans_origin += (oy !== 'n' ? oy + '% ' : '50% '); 
			trans_origin += (oz !== 'n' ? oz + 'px' : ''); 

			_r[transform_orig_css] = trans_origin;
			
			return _r;

		} : function(fade,tx,ty,tz,r,rx,ry,rz,scx,scy,skx,sky,ox,oy,oz) {

			var r = fade === false ? {} : {opacity:0};
			tx  !== 'n' && (r.left = tx * st.rf + 'px');
			ty  !== 'n' && (r.top  = ty * st.rf + 'px');
			return r;
		}			
	};
})(jQuery);
