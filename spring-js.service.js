/*!
 * spring-js.service.js
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
		
		var stringfy = function(o) {
			
			var data = '';
			for (var property in o) {
				var value = o[property]; 
				var type = typeof(value);
				if (value == null) {
					// Nothing to do
				} else if (value["0"] && typeof(value["0"])=='object') {
					data += (data==''?'':',') + '"'+property+'":[';
					var first = true;
					for (var i=0; i<value.length; i++) {
						data += (first?'':',') + stringfy(value[i]);
						first = false;
					}
					data += ']';
				} else if (type == "string") {
					data += (data==''?'':',') + '"'+property+'":"'+value+'"';
				} else if (type == "number") {
					data += (data==''?'':',') + '"'+property+'":'+value;
				} else if (type == "object" && value !== null) {
					data += (data==''?'':',') + '"'+property+'":'+stringfy(value);
				}
			}
			
			return ('{' + data + '}');
		};

		var ajax = function(type, dataType, url, restful, data) {

			if (restful) {
				return $.ajax({
				    dataType: dataType,
				    type: type,
				    url: url + '/' + data
				});
			} else {
				var contentType = 'application/json;charset=utf8';
				return $.ajax({
				    contentType: contentType,
				    data: data?stringfy(data):'{}',
				    dataType: dataType,
				    type: type,
				    url: url
				});
			}
      
		};

		var send = function(parms, dataType, data1, callback) {
			$.when(ajax('POST', dataType, parms.service.url, parms.service.restful, data1), parms.panel.waiter()).then(
				function(data2) {
					if (parms.service.property) {
						callback(data2[0][parms.service.property]);
					} else {
						callback(data2[0]);
					}
				}
			).fail(function(XMLHttpRequest, textStatus, errorThrown) {
	    		if (parms.panel.fail) parms.panel.fail(XMLHttpRequest, textStatus, errorThrown);
			}).always(parms.panel.always);
		};
		
		
		jQuery.fn.formdatalink = function(parms) {

			var p;
			var PROPERTY_TAG = 'data-property';

			this.each(function() {

				$(this).on('change', function() {
					var i = $(this);
					p = i.attr(PROPERTY_TAG);
					v = i.val();
					if (parms && parms.trigger) parms.trigger(p, v);
				});
				
			});

		};
		
		jQuery.fn.loader = function(parms) {

			var template = null;
			if (parms.template) {
				var templateId = parms.template.id;
 				template = templateId +'TPL';
				$('#' + templateId).template(template);
			}

			var $this = this;

			this.on('LOAD', function(e, data1) {
				if (parms.service) {
					send(parms, (parms.template || parms.then)?'json':'text', data1, function(data2) {
						if (parms.then) {
							parms.then(data2);
						} else if (parms.template) {
							$this.trigger('LOADTEMPLATE', [data2]);
						} else {
							$this.html('');
							$this.append(data2);
						}
					});
				} else if (parms.template){
					$.tmpl( parms.template.id, data1 ).appendTo( $this );
				}
			});
			
			var nofirsttime = false;
			this.on('LOADTEMPLATE', function(e, data) {

				var show = function() {
					$this.html('');
					$this.append($.tmpl(template, data));
					if (parms.template.shower) parms.template.shower($this);
					nofirsttime = true;
				};
				
				if (parms.template.remover && nofirsttime) {
					$.when(parms.template.remover($this)).then(show);
				} else {
					show();
				}
				
			});

		};
		
		jQuery.fn.load = function(parms)         {this.trigger('LOAD',[parms]);};
		jQuery.fn.loadTemplate = function(parms) {this.trigger('LOADTEMPLATE',[parms]);};

		
	});
}(window.jQuery);
