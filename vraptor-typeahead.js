/**
 * @author Carlos Spohr (carlos.spohr@gmail.com)
 * 
 * @version 1.2.1
 * 
 * @see https://github.com/bassjobsen/Bootstrap-3-Typeahead
 */
(function ( $ ) {

	var ids 			= new Array();
	var descriptions 	= new Array();
	var fullObjects		= new Array();
	
	$.fn.vraptortypeahead = function(options) {
		
		if($(this).typeahead == undefined){
			console.error('This plugin requires Bootstrap-3-Typeahead plugin. \nYou can get it at https://github.com/bassjobsen/Bootstrap-3-Typeahead');
			return;
		}
		
		options = $.extend(true, {}, $.fn.vraptortypeahead.defaults, options);
		
		if($(options.ui.storeAt).length == 0){
			console.error("Target input '" + options.ui.storeAt + "' to store selected object ID doesn't not exists. Please fix it.");
			return;
		}
		
		return this.each(function(){
			$(this).typeahead({
				minLength: options.minLength,
				showHintOnFocus: options.showHintOnFocus,
				updater:function(item){
					
					var selected = null;
					for ( var i = 0; i < descriptions.length; i++) {
						
						if(descriptions[i] === item){
							$(options.ui.storeAt).val(ids[i]);
							selected = fullObjects[i];
							break;
						}
					}
					
					if(options.ui.input != undefined){
						item = $.fn.vraptortypeahead.descriptionString(selected, options.ui.input);
					}
					
					if($(options.ui.storeAt).valid != undefined){
						$(options.ui.storeAt).valid();
					}
					
					if(options.events.change != undefined){
						if(options.debug){
							console.log("Triggering events...");
						}
						
						options.events.change(selected);
					}
					
					if(options.events.focus != undefined && options.events.focus != null){
						$(options.events.focus).focus().select();
					}
					
					return item;
				},
				source: function(query, process){
					
					options.source.params['query'] = this.value;
					
					if(options.debug){
						console.log(options.source.uri);
						console.debug(options.source.params);
					}
					
					ids 			= new Array();
					descriptions 	= new Array();
					fullObjects		= new Array();
					
					return $.post(options.source.uri, options.source.params, function(data){
						
						if(data == null){
							if(options.debug){
								console.log("Your request has no response.");
							}
							return process(descriptions);
						}
						
						if(data[options.source.jsonListName] == undefined){
							console.error("Response object doesn't contains JSON object list. You had configured this one:  '" + options.source.jsonListName + "'.");
						}
						
						var resultContent = data[options.source.jsonListName];
						
						if(resultContent == null){
							if(options.debug){
								console.log("Your request has no response.");
							}
							return process(descriptions);
						}
						
						for (var i= 0; i < resultContent.length; i++) {
							var object = resultContent[i];
							
							descriptions[i] = $.fn.vraptortypeahead.descriptionString(object, options.ui.list);
							ids			[i] = object[options.ui.id];
							fullObjects [i] = object;
						}
						
						//return process($.fn.vraptortypeahead.highlight(descriptions, query));
						return process(descriptions);
					});
				}
			});
		});
	};
	
	$.fn.vraptortypeahead.highlight = function(descriptions, term) {
		
		for (var i = 0; i < descriptions.length; i++) {
			
			var content = descriptions[i];
			var index = content.indexOf(term);
			if(index > 0){
				content = content.substring(0, index) + "<span style='padding-right:0px; margin-right:0px; background-color: #777; color: #fff;'>" + content.substring(index, index + term.length) + "</span>" + content.substring(index + term.length);
			}
			
			descriptions[i] = content;
		}
		
		return descriptions;
	};
	
	$.fn.vraptortypeahead.byString = function(o, s) {
	    s = s.replace(/\[(\w+)\]/g, '.$1');
	    s = s.replace(/^\./, '');
	    var a = s.split('.');
	    while (a.length) {
	        var n = a.shift();
	        if (n in o) {
	            o = o[n];
	        } else {
	            return;
	        }
	    }
	    return o;
	};
	
	$.fn.vraptortypeahead.descriptionString = function(object, fieldsArray){
		
		var description = "";
		for (var i = 0; i < fieldsArray.length; i++) {

            var field = fieldsArray[i];

			if((/^#/).test(field)){
				description += field.replace("#", '');
			}else{
				if(field.indexOf(".")> 0){
                    description += $.fn.vraptortypeahead.byString(object, field);
				}
				else{
					description += object[field] + " ";
				}
			}
		}
		
		return description.trim();
	};
	
	$.fn.vraptortypeahead.defaults = {
		minLength:5,
		showHintOnFocus: false,
		source: {
			uri: null,
			params:{},
			jsonListName: 'list'
		},
		ui: {
			list: [],
			id: null,
			input: [],
			storeAt:	 null
		},
		events:	{
			focus: null,
			change: function(object){
				
			}
		},
        debug: 		false
    };
	
}( jQuery ));