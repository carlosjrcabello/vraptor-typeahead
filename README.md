
# VRaptor Typeahead

This plugin works as an specific extension for [Bootstrap 3 Typeahead](https://github.com/bassjobsen/Bootstrap-3-Typeahead) plugin to keep development with [VRaptor 3 and 4](http://www.vraptor.org) 
agile and simple when your projects use Twitter Bootstrap 3.

## Dependencies

You must have [Bootstrap 3 Typeahead](https://github.com/bassjobsen/Bootstrap-3-Typeahead), you can download it [here](https://github.com/bassjobsen/Bootstrap-3-Typeahead).

##How to use

It's so simple to procude data, basically you just have to create one method that serializes his response using *Results.json()* class. See this example below. 

```java
@Post({
	"/cities/ajax/find-cities/"
})
public void doSearchCities(final String query){
	
	try {
		final ArrayList<City> cities = dao.find("select c from tb_city c order by c.name");
		
		this.result.use(Results.json()).from(cities).serialize();
	} catch (Exception e) {
		e.printStackTrace();
	}
}
```

## JSP pages

On your forms, you must have two fields, the first one will receive some content description from dropdown list and other one, that is hidden. This one will receive the object ID of selection. The
hidden field will contain *name* attribute to be sent to server.

```html
<div class="form-group">
	<label for="descricaoCidade">
		<fmt:message key='label.cidade'/>
	</label>
	<input 
		type="text" 
		class="form-control input-lg" 
		id="cityName" 
		value="${place.city.name}"
		placeholder="Type the name of city"
	/>
	<input 
		type="hidden" 
		name="place.city.idCity"
		id="idCity" 
		value="${place.city.idCity}"
	/>
	
	<span class="help-inline"></span>
</div>
```

**Tip**: if you are using jQuery.validate on your forms, you can use a span element with 'help-inline' class to store validate messages as others simple input fields. 

## Javascript

Since *1.2.0* version, all configurations were organized and improved. Below you can see an example how to turns your input into *typeahead* component.

**Tip**: by convention, there's just one parameter that is sent in all requests, this parameter is **'query'**. It's contains the input text content.

```javascript

var BASE_URI = "/your-context";

$("#cityName").vraptortypeahead({
    minLength: 3,
    source: {
    	uri: (BASE_URI + "/cities/ajax/find-cities/"),
    	params: {
    		// All your extra params to be appended to mandatory param named as 'query'.
    	}
    },
    ui: {
        list: ["idCity", "# - ", "name" , "#<br/>State: ", "state.name"],
        id: "idCity",
        input: ["name"],
        storeAt: "#idCity"
    },
    debug:  true,
    events:{
    	focus: "#descricao"
    }
});
```
**Tip**: With you use Javascript blocks inside of JSPs pages, you can declare your ajax URI using **c:url value=''/>** to specify the path to controller method.

## Docs

Most important itens you must pay attention:

``ui.list``: an array to describe how to print each result item to user.

``ui.id``: what is the field of JSON object of ajax response.

``ui.input``: an array to describe how to print selected item inside input text.

``ui.storeAt``: what is the input element's ID that will receive the selected object ID.

``events.focus``: after select some item, the specified element ID will gain focus.

Comming soon...
