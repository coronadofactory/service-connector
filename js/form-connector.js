/*!
 * service-connector.js for Twitter Bootstrap
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

		jQuery.fn.form = function(parms) {
		
			var $form = this;

			var orig = {};
			$form.find('select[data-property]').each(function() {
				var c = $(this);
				var p = c.attr('data-property');
				var v = c.attr('data-validator');
				
				orig[p] = new Object();

				if (v && v.indexOf("mdt")>-1) {
					var firstOption = true;
					c.find('option').each(function() {
						var o = $(this);
						if (firstOption) {
							firstOption = !firstOption;
							orig[p]['pre']   = '<option>'+o.html()+'</option>';
							orig[p]['post']  = '';
						} else {
							var id = o.attr('value');
							orig[p]['post'] += '<option value="' + id + '">'+o.html()+'</option>'
						}
					});
				
					orig[p]['option'] = c.find('option').eq(0).html();
				} else {
					orig[p]['pre'];
					orig[p]['post'] = c.html();
				}				



			});

			this.loader({
				service:{url:parms.load.url, restful:parms.load.restful},
				panel:parms.load.panel,
				then:function(data){
					$form.find('input[data-property],textarea[data-property]').each(function() {
						var c = $(this);
						var p = c.attr('data-property');
						c.val(data[p]);
					});
					$form.find('select[data-property]').each(function() {
					
					console.log(data)
						var c = $(this);
						var pv = c.attr('data-property-values');
						var ps = c.attr('data-property-selected');

						var p1 = c.attr('data-key-values');
						var p2 = c.attr('data-value-values');

						if (pv && data[pv]) {
							var c = $(this);
							var p = c.attr('data-property');
						
							var v = orig[p]['pre'];
							$.each(data[pv], function(index, value) {
								v += '<option value="' + value[p1] + '">' + value[p2] + '</option>';
							});
							v += orig[p]['post'];
						
							c.html(v);
							if (ps && data[ps]) c.val(data[ps]['value']);
						}
					});
					if (parms.whenloaded) parms.whenloaded();
				}
			});
			
			if (parms.save) {
			
				this.sender({
					service:{url:parms.save.url},
					panel:parms.save.panel,
					then:function(data){
						if (parms.save.then) parms.save.then();
					}
				});
			
				this.on('SAVE', function(e) {
					var dto = new Object();
					$form.find('*[data-property]').each(function() {
						var i = $(this);
						var p = i.attr('data-property');
						dto[p]=i.val();
					});
					$form.send(dto);
				});
				
			}

			if (parms.submit) {

				a = $(parms.submit.selector);
				var d = 'disabled';
				a.addClass(d);
			
				a.on('click', function(e) {
					e.preventDefault();
					if (a.hasClass(d)) {
						return;
					}
				});

				var v = function(c) {
					var r = true;
					
					if (parms.validator && parms.validator.pre) {
						parms.validator.pre(c);
					};
					
					$form.find('input[data-validator=mdt]:visible,textarea[data-validator=mdt]:visible').each(function() {
						var c2 = $(this);
						r = r && (c2.val() != '');
					});
					$form.find('select[data-validator=mdt]:visible').each(function() {
						var c2 = $(this);
						var p = c2.attr('data-property');
						r = r && !(c2.val()==orig[p]['option']);
					});
				
					if (a.hasClass(d)) {
						if (r) a.removeClass(d);
					} else {
						if (!r) a.addClass(d);
					}
				};
		
				var createEvent = function(event, c1) {
					c1.on(event, function() {
						var c2 = $(this);
						var p = c2.attr('data-property');
						v(c1);
					});
				};
		
				$form.find('input[data-validator=mdt],textarea[data-validator=mdt]').each(function() {
					var c = $(this);
					createEvent('keyup', c);
				});
				$form.find('select[data-validator=mdt]').each(function() {
					var c = $(this);
					createEvent('change', c);
				});
				
				if (parms.submit.action) {
					a.on('click', function() {
						if (!a.hasClass(d)) parms.submit.action();
					});
				};

			}

			if (parms.error && parms.error.clean) {
				$form.find('input,textarea').each(function() {
					var c = $(this);
					c.on('keyup', function() {parms.error.clean.action(parms.error.clean.selector)});
				});
				$form.find('select').each(function() {
					var c = $(this);
					c.on('change', function() {parms.error.clean.action(parms.error.clean.selector)});
				});
			}
			

		};

		jQuery.fn.save = function() {this.trigger('SAVE');};

	});
    
}(window.jQuery);
