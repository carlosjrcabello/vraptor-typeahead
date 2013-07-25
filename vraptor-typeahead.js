(function ( $ ) {

	$.fn.vraptortypeahead = function(options) {
		
		var settings = $.extend({}, $.fn.vraptortypeahead.defaults, options);
		
		var ids 			= new Array();
		var descriptions 	= new Array();
		var fullObjects		= new Array();
		
		return $(this).typeahead({
			minLength: settings.minLength,
			updater:function(item){
				if(settings.debug){
					console.log(item);
				}
				
				var selected = null;
				for ( var i = 0; i < descriptions.length; i++) {
					if(descriptions[i] === item){
						$(settings.out.storeId).val(ids[i]);
						
						selected = fullObjects[i];
						
						break;
					}
				}
				if(settings.debug){
					console.log("invoking events");
				}
				
				settings.events.change(selected);
				
				if(settings.jumpTo != null){
					$(settings.jumpTo).focus().select();
				}
				
				return item;
			},
			source: function(query, process){
				
				var args = {};
				args[settings.params.name] = query;
				
				if(settings.debug){
					console.log(query);
					console.log("settings.uri " + settings.uri);
					console.log("params");
					console.log(args);
				}
				
				ids 			= new Array();
				descriptions 	= new Array();
				fullObjects		= new Array();
				
				return $.post(settings.uri, args, function(data){
					if(settings.debug){
						console.log(data);
						console.log(data.list);
					}
					if(data != null && data.list != null){
						for (var i= 0; i < data.list.length; i++) {
							var object = data.list[i];
							
							descriptions[i] = $.fn.vraptortypeahead.builders.descriptionString(object, settings);
							ids			[i] = object[settings.out.id];
							fullObjects [i] = object;
						}
					}
					
					return process(descriptions);
				});
			}
		});
		
		return this;
	};
	
	$.fn.vraptortypeahead.builders = {
			
	};
	
	$.fn.vraptortypeahead.builders.descriptionString = function(object, settings){
		
		if(settings.out.description.indexOf(',') > 0){
			var fields = settings.out.description.split(',');
			
			var description = "";
			for (var i= 0; i < fields.length; i++) {
				if(settings.methods.customizeWhen != undefined){
					description += settings.methods.customizeWhen(object[fields[i]], object, fields[i]);
				}
				else{
					description += object[fields[i]] + " ";
				}
			}
			
			return description;
		}
		else{
			return object[settings.out.description];
		}
	};
	
	$.fn.vraptortypeahead.defaults = {
		out: 		{
			id: 		 null,
			description: null,
			storeId:	 null
		},
		uri: 		null,
		params:		{
			name: 		null
		},
		minLength:	5,
		events:		{
			change: function(object){
				
			}
		},
		// all methods;
		methods:	{
			jumpTo:	null,
			// You can modify html or another information based
			// an any idea.
			customizeWhen: function(description, object, field){
				return description;
			}
		},
		// debug configs.
        debug: 		false
    };
	
}( jQuery ));