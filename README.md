This is a simple extension for Twitter Bootstrap Typeahead (2.3.x) to work with Bootstrap 2 or 3 on Java projects with *VRaptor MVC framework*, on versions 3.x and 4.x.

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
On your pages.
```javascript
$("#descricaoCidade").vraptortypeahead({
	//Number of chars to trigger the search.
    minLength:3,
    // HTTP Post params.
    params: {
        name: "cidade.nome"
    },
    // These are the fields that will be displayed on typeahead list.
    // Use "#" as a joker for separator fields
    // storeId - ID of html input that will receive the selected object id.
    out: {
        description: [
        	"nome", "# - ", "uf"
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

Comming...
