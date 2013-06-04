A focused extension of typeahead from Twitter Bootstrap to work with VRaptor MVC framework.

Usage

```javascript
$("#descSupplier").vraptortypeahead({
	minLength:3,
	params:	{
		name: "sup.name"
	},
	out:	{
		description: "name",
		id: "id",
		storeId: "#idSupplier"
	},
	uri: 	"<c:url value='/financial/suppliers/ajax/find-suppliers/'/>",
	debug:	false,
	events:{
		change: function(object){
			alert(object);
		}
	},
	jumpTo: "#idAccountPlan"
});
```

Events and methods

Comming...
