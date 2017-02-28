/**
 * @author Carlos Spohr (carlos.spohr@gmail.com)
 * 
 * @version 1.2.0
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
		
		var settings = $.extend(true, $.fn.vraptortypeahead.defaults, options);
		
		if($(settings.ui.storeAt).length == 0){
			console.error("Target input '" + settings.ui.storeAt + "' to store selected object ID doesn't not exists. Please fix it.");
			return;
		}
		
		return $(this).typeahead({
			minLength: settings.minLength,
			updater:function(item){
				
				var selected = null;
				for ( var i = 0; i < descriptions.length; i++) {
					
					if(descriptions[i] === item){
						$(settings.ui.storeAt).val(ids[i]);
						selected = fullObjects[i];
						break;
					}
				}
				
				if(settings.ui.input != undefined){
					item = $.fn.vraptortypeahead.descriptionString(selected, settings.ui.input);
				}
				
				if($(settings.ui.storeAt).valid != undefined){
					$(settings.ui.storeAt).valid();
				}
				
				if(settings.events.change != undefined){
					if(settings.debug){
						console.log("Triggering events...");
					}
					
					settings.events.change(selected);
				}
				
				if(settings.events.focus != undefined && settings.events.focus != null){
					$(settings.events.focus).focus().select();
				}
				
				return item;
			},
			source: function(query, process){
				
				settings.source.params['query'] = this.value;
				
				if(settings.debug){
					console.log(settings.source.uri);
					console.debug(settings.source.params);
				}
				
				ids 			= new Array();
				descriptions 	= new Array();
				fullObjects		= new Array();
				
				return $.post(settings.source.uri, settings.source.params, function(data){
					
					if(data == null){
						if(settings.debug){
							console.log("Your request has no response.");
						}
						return process(descriptions);
					}
					
					if(data[settings.source.jsonListName] == undefined){
						console.error("Response object doesn't contains JSON object list. You had configured this one:  '" + settings.source.jsonListName + "'.");
					}
					
					var resultContent = data[settings.source.jsonListName];
					
					if(resultContent == null){
						if(settings.debug){
							console.log("Your request has no response.");
						}
						return process(descriptions);
					}
					
					for (var i= 0; i < resultContent.length; i++) {
						var object = resultContent[i];
						
						descriptions[i] = $.fn.vraptortypeahead.descriptionString(object, settings.ui.list);
						ids			[i] = object[settings.ui.id];
						fullObjects [i] = object;
					}
					
					return process($.fn.vraptortypeahead.highlight(descriptions, query));
				});
			}
		});
		
		return this;
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