
# VRaptor Typeahead

This plugin works as an specific extension for [Bootstrap 3 Typeahead](https://github.com/bassjobsen/Bootstrap-3-Typeahead) plugin to keep development with [VRaptor 3 and 4](http://www.vraptor.org) agile and simple.


This is a simple extension based in older Twitter Bootstrap Typeahead (2.3.x) to work with Bootstrap 2 or 3 on Java projects with *VRaptor MVC framework*, on versions 3.x and 4.x.

How to use

```java
@Post("/basicos/cidades/consulta-cidades-ajax/")
public void findCidadesAJAX(Cidade cidade){
	// Your validations...
	if(cidade == null || cidade.getDescricao() == null){
		this.result.nothing();
		return;
	}
	try {
		ArrayList<Cidade> cidades = dao.findByQuery("SELECT * FROM tb_cities");
		// The list will be serialized named as 'list'. The JS plugin will be detected this.
		this.result.use(Results.json()).from(cidades).serialize();
	} catch (Exception e) {
		e.printStackTrace();
		this.result.nothing();
	}
}
```
On your JSP pages.

```html
<div class="form-group">
	<label for="descricaoCidade">
		<fmt:message key='label.cidade'/>
	</label>
	<input 
		type="text" 
		class="form-control input-lg" 
		id="descricaoCidade" 
		value="${perfil._cidade}"
		placeholder="<fmt:message key='label.cidade.placeholder'/>"
	/>
	<input 
		type="text" 
		class="form-control input-lg" 
		name="inscricao.idCidade"
		id="idCidade" 
		value="${perfil.idCidade}"
	/>
</div>
```

Still on JSP pages (attempts to c:url tag on uri proprety).

```javascript
$("#descricaoCidade").vraptortypeahead({
	//Number of chars to trigger the search.
    minLength: 3,
    // HTTP Post params.
    params: {
        name: "cidade.nome"
    },
    // These are the fields that will be displayed on typeahead list.
    // Use "#" as a joker for separator fields
    // storeId - ID of html input that will receive the selected object id.
    out: {
        description: [
        	"nome", "# - ", "estado.nome", "# - ", "estado.pais.nome"
        ],
        id: "idCidade",
        storeId: "#idCidade"
    },
    uri:    "<c:url value='/basicos/cidades/consulta-cidades-ajax/'/>",
    debug:  false,
    // After your select a value, the focus will changed to element below.
    jumpTo: "#logradouro"
});
```

Events and methods

Comming soon...
