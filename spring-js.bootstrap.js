/*!
 * spring-js.bootstrap.js
 * https://github.com/coronadoland
 * 
 * Copyright (c) 2011-2013 Jose Antonio Garcia
 * Released under the MIT license
 * https://raw.github.com/coronadoland/spring-js/master/LICENSE.txt
 *
 * Date: 2013-04-10
 */

!function ($) {
	$(function(){
		
		jQuery.fn.sidebar = function(parms) {

			var $this = this;
			
			$.get(parms.menu, function(html) {
				$this.append(html);
				if (parms.href) {
					var a = $this.find('a[href='+parms.href+']');
					var li = a.closest('li');
					li.addClass('active');
				}
			});
			
		};

		
		jQuery.fn.loaderaction = function(parms) {
			this.loader(parms);
			
			var $this = this;
			this.find('a').on('click', function(e) {
				if (parms.input) {
					$this.trigger('LOAD', [parms.input()]);
				} else {
					$this.trigger('LOAD');
				}
			});
		};
		
		jQuery.fn.bootstrapdatalink = function(parms) {

			var p;
			var PROPERTY_ID  = 'data-id';
			var PROPERTY_TAG = 'data-property';

			if (this.hasClass('btn-group')) {
				var ul = this.find('ul');
				p = ul.attr(PROPERTY_TAG);
				ul.find('a').on('click', function() {
					var a = $(this);
					var li = a.closest('li');
					li.addClass('active');
					var v = li.attr(PROPERTY_ID);
					if (parms && parms.trigger) parms.trigger(p, v);
				});
			}

		};
		
	});
    
}(window.jQuery);
