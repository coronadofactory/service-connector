/*!
 * service-connector.js
 * http://coronadoland.com/service-connector
 *
 * Copyright (c) 2011-2013 Jose Antonio Garcia
 * Released under the MIT license
 * https://raw.github.com/coronadoland/service-connector/master/LICENSE.txt
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
				} else if (type == "number" || type == "boolean") {
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
				
				// To server
				var contentType = 'application/json;charset=utf8';

				return $.ajax({
				    contentType: contentType,
//				    data: data?stringfy(data):'{}',
				    data: data?JSON.stringify(data):'{}',
				    dataType: dataType,
				    type: type,
				    url: url
				});
			}
      
		};

		var send = function(parms, dataType, data1, callback, element) {
			$.when(ajax('POST', dataType, parms.service.url, parms.service.restful, data1), parms.panel.waiter(element)).then(
				function(data2) {
					if (parms.panel &&  parms.panel.success) parms.panel.success();
					if (parms.service.property) {
						callback(data2[0][parms.service.property]);
					} else {
						callback(data2[0]);
					}
				}
			).fail(function(XMLHttpRequest, textStatus, errorThrown) {
	    		if (parms.panel.fail) parms.panel.fail(XMLHttpRequest.status, XMLHttpRequest.responseText, XMLHttpRequest, textStatus, errorThrown);
			}).always(function(){
				parms.panel.always(element);
			});
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
				_.templateSettings.variable = "rc";
				
				if (parms.template.id) {
					var templateId = parms.template.id;
 					template = _.template($('#'+templateId).html());
 				}
				
			}

			var $this = this;
			
			this.on('LOAD', function(e, data1, parmsexec) {
				if (parms.service) {
				
					var type = null;
					if (parms.template) {
						type = 'json';
					} else if (parms.then) {
						type = 'json';
					} else if (parmsexec && parmsexec.then) {
						type = 'json';
					} else {
						type = 'text';
					}					
				
					var element = null;
					if (parmsexec && parmsexec.element) {element = parmsexec.element}
					send(parms, type, data1, function(data2) {
						if (parms.then) {
							parms.then(data2);
						} else if (parms.template) {
							$this.trigger('LOADTEMPLATE', [data2]);
						} else if (parmsexec && parmsexec.then) {
						 	parmsexec.then(data2)
						} else {
							$this.html('');
							$this.append(data2);
						}
					}, element);
					
//				} else if (parms.template){
//					$.tmpl( parms.template.id, data1 ).appendTo( $this );
				}
			});

			if (parms.template) {
			
				var nofirsttime = false;
				
				
				this.on('LOADTEMPLATE', function(e, data) {
				
					var show = function() {
						$this.html('');
						if (data) $this.append(template(data));
						if (parms.template && parms.template.shower) parms.template.shower($this);
						nofirsttime = true;
					};
				
					var show2 = function() {
						if (parms.template && parms.template.remover && nofirsttime) {
							$.when(parms.template.remover($this)).then(show);
						} else {
							show();
						}
					};
				
					if (parms.template.url && template==null) {
						$.ajax({
				   	        url: parms.template.url, method: 'GET', dataType: 'text'
				        }).then(function(data) {
				        	template = _.template(data);
				        	show2();
				        }).fail(function(XMLHttpRequest, textStatus, errorThrown) {
							if (window.console) console.log(textStatus);
						});

					} else {
						show2();
					}
				
				
				});
				
			}

		};
		
		jQuery.fn.load = function(data1, data2) {this.trigger('LOAD',[data1, data2]);};
		jQuery.fn.loadTemplate = function(data) {this.trigger('LOADTEMPLATE',[data]);};

		
		jQuery.fn.sender = function(parms) {
			this.on('SEND', function(e, data1, element) {
				if (parms.service) {
					send(parms, 'json', data1, function(data2) {
						if (parms.then) {
							parms.then(data2, element);
						}
					}, element);
				}
			});
		};
		
		jQuery.fn.send = function(data1, data2) {this.trigger('SEND',[data1, data2]);};
		
		
		jQuery.fn.loadScript = function(parms) {
	
			var $deferreds = [];
			var $this = this;
			
  			if (parms.templates) {
				var index = 0;
  				$.each(parms.templates, function(index, template) {
		 		    var dfd = new jQuery.Deferred();
		 			$deferreds[index++] = dfd;

	 				$.ajax({
			   	        url: template.url, method: 'GET', dataType: 'text'
			        }).then(
           				function (data) {
           					if (template.name) {
							    $('head').append('<script id="' + template.name + '" type="text/template">' + data + '</script>');
           					} else {
								$this.html(data);	// Error
   							}        					
        	       			dfd.resolve();
					}).fail(function(XMLHttpRequest, textStatus, errorThrown) {
						dfd.fail(XMLHttpRequest, textStatus, errorThrown);
					});
  				});
  			} else {
  			
 	 		    var dfd = new jQuery.Deferred();
	 			$deferreds[0] = dfd;
	 			
	 			$.ajax({
			   	   url: parms.url, method: 'GET', dataType: 'text'
			    }).then(function (data) {
					$this.html(data);
	   	       		dfd.resolve();
				}).fail(function(XMLHttpRequest, textStatus, errorThrown) {
					dfd.fail(XMLHttpRequest, textStatus, errorThrown);
				});
				
  			}
  				
			return $.when.apply(null, $deferreds);
		    
		}
        
		
	});
}(window.jQuery);
