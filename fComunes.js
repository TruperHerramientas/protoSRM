

var proveedores 		= null;
var contactos   		= null;
var productos   		= null;
var ordenesCompra 		= null;
var ordenesCompraClon 	= null;

function inicializaMapas(){
	contactos 	= new Array();
	proveedores = new Array();
	productos 	= new Array();
	ordenesCompra = new Array();
	ordenesCompraClon = new Array();
	
	for(var i=0; i<data.proveedores.length; i++){
		var p = new Proveedor();
		p.setJSON(data.proveedores[i]);
		proveedores.push(p);
	}
	for(var i=0; i<data.productos.length; i++){
		var p = new Producto();
		p.setJSON(data.productos[i]);
		productos.push(p);
	}
	
	for(var i=0; i<data.contactos.length; i++){
		var c = new Contacto();
		c.setJSON(data.contactos[i]);
		contactos.push(c);
	}

	for(var i=0; i<data.ordenes.length; i++){
		var oc = new OrdenCompra();
		oc.setJSON(data.ordenes[i]);
		ordenesCompra.push(oc);
		
		var oclon = new OrdenCompra();
		oclon.setJSON(data.ordenes[i]);
		ordenesCompraClon.push(oclon);
	}
}

function guardaStorageData(id, data){
	var string = JSON.stringify(data);
	window.localStorage.setItem(id, data);
}

function dameStorageData(id){
	var data = window.localStorage.getItem(id);
	if(esNulo(data))
		return null;
	data = JSON.parse(data);
	return data;
}

function esNulo(variable){
	return (variable == null || typeof variable === "undefined");
}

function dameProveedor(id){
	var p = new Proveedor();
	p.i = id;
	p.n = 'Proveedor Desconocido';
	p.p = 'País Desconocido';
	if(esNulo(id))
		return p;
	if(esNulo(proveedores))
		inicializaMapas();
	var prov = null;
	for(var i=0; i<proveedores.length; i++){
		if(proveedores[i].i === id){
			prov = proveedores[i];
			break;
		}
	}
	return (esNulo(prov) ? p : prov);
}

function dameProducto(codigo){
	var p = new Producto();
	p.c = codigo;
	p.l = 'PD-9999';
	p.d = 'Producto Desconocido';
	p.p = 1;	
	if(esNulo(codigo))
		return p;
	if(esNulo(productos))
		inicializaMapas();
	var prod = null;
	for(var i=0; i<productos.length; i++){
		if(productos[i].c === codigo){
			prod = productos[i];
			break;
		}
	}if(!esNulo(prod)){
		p.w = parseFloat(p.w)/1000;
		p.v = parseFloat(p.v)/1000;
	}
	return (esNulo(prod) ? p : prod);
}

function damePlaneador(id){
	var p = new Contacto();
	p.i = id;
	p.n = 'Planeador Desconocido';
	if(esNulo(id))
		return p;
	if(esNulo(contactos))
		inicializaMapas();
	var plan = null;
	for(var i=0; i<contactos.length; i++){
		if(contactos[i].i === id){
			plan = contactos[i];
			break;
		}
	}
	return (esNulo(plan) ? p : plan);
}

function dameComprador(id){
	var c = new Contacto();
	c.i = id;
	c.n = 'Comprador Desconocido';
	if(esNulo(id))
		return p;
	if(esNulo(contactos))
		inicializaMapas();
	var comp = null;
	for(var i=0; i<contactos.length; i++){
		if(contactos[i].i === id){
			comp = contactos[i];
			break;
		}
	}
	return (esNulo(comp) ? c : comp);
}


function dameOrdenCompra(id){
	var oc = new OrdenCompra();
	this.i	= id
	this.s	= 'Sin Orden Compra Secundaria'
	this.p	= null;		
	this.c	= null;	
	this.f	= null;	
	this.t	= null;	
	this.e	= null;	
	this.pe	= null;	
	this.pr	= null;	
	this.a	= null;	
	this.r	= null;		

	if(esNulo(id))
		return oc;
	if(esNulo(ordenesCompraClon))
		inicializaMapas();
	var ocAux = new OrdenCompra();
	for(var i=0; i<ordenesCompraClon.length; i++){
		if(ordenesCompraClon[i].i === id){
			ocAux = ordenesCompraClon[i];
			break;
		}
	}
	return (esNulo(ocAux) ? oc : ocAux);
}

function creaOrdenes(){
	console.log('creaOrdenes');
	if(esNulo(ordenesCompra))
		inicializaOrdenesCompra();	
	for(var i=0; i<ordenesCompra.length; i++){
		var tarea = new Tarea();
		tarea.nombre = "Autorizacion planeacion";
		tarea.role = "planeador";
		tarea.idTipoTarea = "P";
		var tarea2 = new Tarea();
		tarea2.nombre = "Autorizacion compras";
		tarea2.role = "comprador";
		tarea2.idTipoTarea = "C"; 
		ordenesCompra[i].tarea = new Array();
		var indexTask1 = ordenesCompra[i].tarea.push(tarea);
		var indexTask2 = ordenesCompra[i].tarea.push(tarea2);
		ordenesCompra[i].indexCurrentTask = [0,1];
	}
	saveScreenshot();
}

function formateaNumero(number, decimals){
	return numberToCurrency(number, '', decimals);
}

function numberToCurrency(number, currencySymbol, decimals) {
    	var thousandsSeparator = ',';
    	number = stripDollarSign(number);
    	number = isNaN(number) || number == '' || number == null ? 0.00 : number;
    	var numberStr = parseFloat(number).toFixed(decimals).toString();
    	var numberFormatted = new Array(numberStr.slice(-(Number(decimals) + 1)));   // this returns the decimal and cents
    	numberStr = numberStr.substring(0, numberStr.length-(Number(decimals) + 1)); // this removes the decimal and cents
    	/* Why is there an `unshift()` function, but no `shift()`? 		*
		*  Also, a `pop()` function would be handy here.				*/
    	while (numberStr.length > 3) {
        	numberFormatted.unshift(numberStr.slice(-3)); // this prepends the last three digits to `numberFormatted`
        	numberFormatted.unshift(thousandsSeparator); // this prepends the thousandsSeparator to `numberFormatted`
        	numberStr = numberStr.substring(0, numberStr.length-3);  // this removes the last three digits
    	}
    	numberFormatted.unshift(numberStr); // there are less than three digits in numberStr, so prepend them
    	numberFormatted.unshift(currencySymbol); // prepend the currencySymbol
    return numberFormatted.join(''); // put it all together
}

function stripDollarSign(s) {
    if (typeof s == 'string') { s = s.replace(/\$/g, ''); }
    return s;
}

function despliegaEncabezadoOrdenCompra(idOc){
	var ordenCompra = dameOrdenCompra(idOc);
	if(esNulo(ordenCompra)){
		alert('Orden de Compra Incorrecta');
		return;
	}
	var pesoTotal = 0.0, volumenTotal = 0.0, montoTotal = 0.0;
	for(var i=0;i<ordenCompra.detalle.length;i++){
		if(esNulo(ordenCompra.detalle[i]))
			continue;
		var producto = dameProducto(ordenCompra.detalle[i].c);
		if(esNulo(producto)){
			producto = new Producto();
			producto.w = 1.0;
			producto.v = 1.0;
		}
		pesoTotal 	 += (parseFloat(producto.w) * parseFloat(ordenCompra.detalle[i].a));
		volumenTotal += (parseFloat(producto.v) * parseFloat(ordenCompra.detalle[i].a));
		montoTotal 	 += (parseFloat(producto.p) * parseFloat(ordenCompra.detalle[i].a));
	}
	
	var proveedor = dameProveedor(ordenCompra.v);
	document.getElementById("idPoProveedor").innerHTML 	= '[' + ordenCompra.v + ']&nbsp;' + (esNulo(proveedor) ?  'Proveedor Desconocido' : proveedor.n + ' ( ' + proveedor.p + ') '); 
		
	document.getElementById("idSemaforoOc").innerHTML 	= '<img src="img/' + dameSemaforoOC(ordenCompra) + '" width="20" height="20" />';
	document.getElementById("idPesoTotal").innerHTML 	= formateaNumero(parseFloat(pesoTotal),2);
	document.getElementById("idVolumenTotal").innerHTML = formateaNumero(parseFloat(volumenTotal),2);
	document.getElementById("idMontoTotal").innerHTML 	= '$' + formateaNumero(parseFloat(montoTotal),2);
	
	var planeador = damePlaneador(ordenCompra.p);
	var comprador = dameComprador(ordenCompra.c);
	
	document.getElementById("idPlaneador").innerHTML 	= ordenCompra.p + ' - ' + (esNulo(planeador) ? ' ' : planeador.n);
	document.getElementById("idComprador").innerHTML 	= ordenCompra.c + ' - ' + (esNulo(comprador) ? ' ' : comprador.n);
	
	document.getElementById("idCondicionesEnvio").innerHTML 	= ordenCompra.e;
	document.getElementById("idPuertoEnvio").innerHTML 	= esNulo(ordenCompra.pe) ?  '' : ordenCompra.pe;
	document.getElementById("idPuertoRec").innerHTML 	= esNulo(ordenCompra.pr) ?  '' : ordenCompra.pr;
	
	document.getElementById("idTerminosPago").innerHTML 	= esNulo(ordenCompra.t) ?  '' : ordenCompra.t;
	document.getElementById("idFecha").innerHTML 			= esNulo(ordenCompra.f) ?  'S/F' : formateaFechaItoS(ordenCompra.f);
}

function despliegaDetalleOrdenCompra(idOc){
	var ordenCompra = dameOrdenCompra(idOc);
	if(esNulo(ordenCompra)){
		alert('Orden de Compra Incorrecta');
		return;
	}
	var tabla = '';
	tabla += '<tr>';
	tabla += '	<th>&nbsp;</th>';
	tabla += '	<th>&nbsp;</th>';
	tabla += '	<th>Posici&oacute;n</th>';
	
	tabla += '	<th class="hideInTimeLine">Codigo</th>';
	tabla += '	<th class="hideInTimeLine">Clave</th>';
	tabla += '	<th class="hideInTimeLine">Descripci&oacute;n</th>';
	
	tabla += '	<th class="showInTimeLine">Producto</th>';
	
	
	tabla += '	<th>Peso</th>';
	tabla += '	<th>Volumen</th>';
	tabla += '	<th>Cantidad</th>';
	tabla += '	<th>Precio p/Unidad</th>';
	tabla += '	<th>Total</th>';
	tabla += '</tr>';
	for(var i=0;i<ordenCompra.detalle.length;i++){
		if(esNulo(ordenCompra.detalle[i]))
			continue;
		var producto = dameProducto(ordenCompra.detalle[i].c);
		if(esNulo(producto)){
			producto = new Producto();
			producto.c = ordenCompra.detalle[i].c
			producto.l = 'CLV-UNKN';
			producto.d = 'Producto Desconocido';
			producto.p = 1.0;
			producto.y = null;
			producto.z = null;
			producto.w = 1.0;
			producto.v = 1.0;
		}
		tabla += '<tr>';
		tabla += '	<td id="SEM_I_' + ordenCompra.detalle[i].p + '"><a href="JavaScript:verIndicadores(\'' + ordenCompra.detalle[i].p + '\')"><img src="img/plus.gif" width="16" height="16" border="0" title="Ver Indicadores..."/></a></td>';
		tabla += '	<td><img src="img/' + dameSemaforoPosicion(ordenCompra.detalle[i]) + '" width="16" height="16" /></td>';
		tabla += '	<td>' + ordenCompra.detalle[i].p + '</td>';
		tabla += '	<td>' + producto.c + '</td>';
		tabla += '	<td>' + producto.l + '</td>';
		tabla += '	<td>' + producto.d + '</td>';
		tabla += '	<td>' + formateaNumero((parseFloat(producto.w) * parseFloat(ordenCompra.detalle[i].a)),2) + ' kg</td>';
		tabla += '	<td>' + formateaNumero((parseFloat(producto.v) * parseFloat(ordenCompra.detalle[i].a)),2) + ' m3</td>';
		tabla += '	<td>' + ordenCompra.detalle[i].a + '</td>';
		tabla += '	<td>' + numberToCurrency(producto.p, '$', 2)  + '</td>';
		tabla += '	<td>' + numberToCurrency((parseFloat(producto.p) * parseFloat(ordenCompra.detalle[i].a)),'$',2) + '</td>';
		tabla += '</tr>';
		tabla += '<tr>';
		tabla += '	<td colspan="11">'
		tabla += '		<table cellpadding="0" cellspacing="0" width="100%" border="0" style="display:none;" id="SEM_' + ordenCompra.detalle[i].p + '">';
		tabla += '			<tr>';
		tabla += '				<td rowspan="2" width="100px">&nbsp;</td>';
    	tabla += '				<td rowspan="2"><img src="img/' + dameSemaforo (ordenCompra.detalle[i].di, producto.dm, producto.dx) + '" width="16" height="16" /></td>';
        tabla += '				<td rowspan="2"><b>D&iacute;as de Inv</b></td>';
        tabla += '				<td colspan="4" align="center">' + (esNulo(ordenCompra.detalle[i].di) ? 0 : ordenCompra.detalle[i].di) + '</td>';
        
        tabla += '				<td rowspan="2"><img src="img/' + dameSemaforo (ordenCompra.detalle[i].dia, producto.dam, producto.dax) + '" width="16" height="16" /></td>';
        tabla += '				<td rowspan="2"><b>D&iacute;as de Inv<br/>Al Arribo</b></td>';
      	tabla += ' 				<td colspan="4" align="center">' + (esNulo(ordenCompra.detalle[i].dia) ? 0 : ordenCompra.detalle[i].dia) + '</td>';
        
        tabla += '				<td rowspan="2"><img src="img/' + dameSemaforo (ordenCompra.detalle[i].bo, producto.bm, producto.bx) + '" width="16" height="16" /></td>';
        tabla += '				<td rowspan="2"><b>BO</b></td>';
        tabla += '				<td colspan="4" align="center">' + (esNulo(ordenCompra.detalle[i].bo) ? 0 : ordenCompra.detalle[i].bo) + '</td>';
        
        tabla += '				<td rowspan="2"><img src="img/' + dameSemaforo (ordenCompra.detalle[i].boa, producto.bam, producto.bax)  + '" width="16" height="16" /></td>';
        tabla += '				<td rowspan="2"><b>BO al Arribo</b></td>';
        tabla += '				<td colspan="4" align="center">' + (esNulo(ordenCompra.detalle[i].boa) ? 0 : ordenCompra.detalle[i].boa) + '</td>';
    	tabla += '			</tr>';
    	tabla += '				<tr>';
    	tabla += '					<td align="center">Min</td>';
        tabla += '					<td align="center">' + (esNulo(producto.dm) ? 0 : producto.dm) + '</td>';
        tabla += '					<td align="center">Max</td>';
        tabla += '					<td align="center">' + (esNulo(producto.dx) ? 0 : producto.dx) + '</td>';
        
        tabla += '					<td align="center">Min</td>';
        tabla += '					<td align="center">' + (esNulo(producto.dam) ? 0 : producto.dam)+ '</td>';
        tabla += '					<td align="center">Max</td>';
        tabla += '					<td align="center">' + (esNulo(producto.dax) ? 0 : producto.dax)+ '</td>';
        
       	tabla += ' 					<td align="center">Min</td>';
        tabla += '					<td align="center">' + (esNulo(producto.bm) ? 0 : producto.bm)+ '</td>';
       	tabla += ' 					<td align="center">Max</td>';
        tabla += '					<td align="center">' + (esNulo(producto.bx) ? 0 : producto.bx)+ '</td>';
        
        tabla += '					<td align="center">Min</td>';
        tabla += '					<td align="center">' + (esNulo(producto.bam) ? 0 : producto.bam) + '</td>';
        tabla += '					<td align="center">Max</td>';
        tabla += '					<td align="center">' + (esNulo(producto.bax) ? 0 : producto.bax) + '</td>';
    	tabla += '				</tr>';
		tabla += '			</table>';
		tabla += '	</td>';
		tabla += '</tr>';
	}
	document.getElementById("idPoProdDetTable").innerHTML = tabla;
	return;
}
	function formateaFechaItoS(fecha){
		var anio  = String(fecha).substring(0, 4);
		var mes   = String(fecha).substring(4, 6);
		var dia   = String(fecha).substring(6);
		var fecha = dia + '/' + mes + '/' + anio;
		return fecha;
	}
	
	function valorEntreRango(value, minValue, maxValue){
		value 	 = (esNulo(value) 	 ? Number(-1)  : Number(value));
		minValue = (esNulo(minValue) ? Number(0)   : Number(minValue));
		maxValue = (esNulo(maxValue) ? Number(0)   : Number(maxValue));	
		return (Number(value) >= Number(minValue) && Number(value) <= Number(maxValue));
	}
	function dameSemaforo(value, minValue, maxValue){
		if(valorEntreRango(value, minValue, maxValue))
			return 'sV.png';
		else
			return 'sR.png';
	}
	
	function dameEvalSemPosicion(detalleOc){
		if(esNulo(detalleOc))
			return false;
		var producto = dameProducto(detalleOc.c);
		if(esNulo(producto))
			return false;
		
		if(!valorEntreRango(detalleOc.di, producto.dm, producto.dx))
			return false;
		if(!valorEntreRango(detalleOc.dia, producto.dam, producto.dax))
			return false;	
		if(!valorEntreRango(detalleOc.bo, producto.bm, producto.bx))
			return false;
		if(!valorEntreRango(detalleOc.boa, producto.bam, producto.bax))
			return false;
		return true;	
	}
	
	function dameSemaforoPosicion(detalleOc){
		if(!dameEvalSemPosicion(detalleOc))
			return 'sR.png';
		return 'sV.png';
	}
	
	function dameEvalSemOC_SOC(ordenCompra){
		var oc = dameOrdenCompra(ordenCompra);
		return dameEvalSemOC(oc);
	}
	
	function dameSemaforoOC_SOC(ordenCompra){
		if(!dameEvalSemOC_SOC(ordenCompra))
			return 'sR.png';
		return 'sV.png';
	}
	
	function dameEvalSemOC(ordenCompra){
		if(esNulo(ordenCompra) || esNulo(ordenCompra.detalle))
			return false;
		if(ordenCompra.detalle.length == 0)
			return true;	
		for(var i=0; i<ordenCompra.detalle.length; i++){
			var bandera = dameEvalSemPosicion(ordenCompra.detalle[i]);
			if(!bandera)
				return false;
		}
		return true;	
	}
	
	function dameSemaforoOC(ordenCompra){
		if(!dameEvalSemOC(ordenCompra))
			return 'sR.png';
		return 'sV.png';
	}
	
	function isHidden(el) {
    	return (el.offsetParent === null)
	}

	function verIndicadores(id){
		if(isHidden(document.getElementById("SEM_" + id))){
			document.getElementById("SEM_" + id).style.display = "inline-block";
			document.getElementById("SEM_I_" + id).innerHTML = '<a href="JavaScript:verIndicadores(\'' + id+ '\')"><img src="img/minus.gif" width="16" height="16" border="0" title="Esconder Indicadores..."/></a>';
		}else{
			document.getElementById("SEM_" + id).style.display = "none";
						document.getElementById("SEM_I_" + id).innerHTML = '<a href="JavaScript:verIndicadores(\'' + id+ '\')"><img src="img/plus.gif" width="16" height="16" border="0" title="Ver Indicadores..."/></a>';
		}
	}
	
	function verNotificaciones(){
		if(isHidden(document.getElementById("notificaciones"))){
			document.getElementById("4").style.width = "45em";
			document.getElementById("contentContainer").style.width = "70em";
			document.getElementById("upperDiv").style.display = "inline-block";
			document.getElementById("upperDiv").style.width = "auto";
			document.getElementById("notificaciones").style.display = "inline-block";
			document.getElementById("2").style.width =  "65em";
		}else{
			document.getElementById("4").style.width = "60em";
			document.getElementById("contentContainer").style.width = "84em";
			document.getElementById("upperDiv").style.display = "inline-block";
			document.getElementById("upperDiv").style.width = "auto";
			document.getElementById("notificaciones").style.display = "none";
			document.getElementById("2").style.width =  "80em";
		}
	}
	
	function ocultaBotonesDetalle(){
		document.getElementById("so_pestania").style.display = "none";
		document.getElementById("so_spc").style.display = "none";
		document.getElementById("tl_pestania").style.display = "none";
		document.getElementById("tl_spc").style.display = "none";
	}
	
	function muestraBotonesDetalle(){
		document.getElementById("so_pestania").style.display = "inline-block";
		document.getElementById("so_spc").style.display = "inline-block";
		document.getElementById("tl_pestania").style.display = "inline-block";
		document.getElementById("tl_spc").style.display = "inline-block";
	}
	
	function ocultaBotonesBandeja(){
		document.getElementById("db_pestania").style.display = "none";
		document.getElementById("db_spc").style.display = "none";
		document.getElementById("notificaciones").style.display = "none";
	}
	
	function muestraBotonesBandeja(){
		document.getElementById("db_pestania").style.display = "inline-block";
		document.getElementById("db_spc").style.display = "inline-block";
	}
	
	function seguirOrden(){
		alert('A Partir de Este Momento Todas las Acciones para Esta Orden Serán Visualizadas como Notificaciones!');
	}
	
	function buscarOrden(){
		alert('Buscando Orden');
	}
	
	function cambiaPagina(pagina){
		window.location.href = pagina ;		
	}
	
	 	function getURLParameter(name) {
    	return decodeURI(
        	(RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    	);
	}