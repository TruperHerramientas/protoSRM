var mapaTareas = [];
// Acciones generales
var rechazo = new AccionesTarea();
var au = new AccionesTarea();
var aubad = new AccionesTarea();
var redir = new AccionesTarea();
var cargaDocs = new AccionesTarea();
var auDocs = new AccionesTarea();
var dChkLst = new AccionesTarea();
var cyeDDG = new AccionesTarea();
// FILTERS
var todas = new Filter(); // todas
// planeador
var nuevas = new Filter(); // nuevas *posibleGeneral
var rechazo = new Filter(); // rechazadas *posibleGeneral
var prov = new Filter(); // delProveedor
var formAut = new Filter(); // formatoAutorizado
var asig = new Filter(); // porAsignacion
// gerentePlaneacion
var delPlaneador = new Filter();
var redireccionadas = new Filter();
// directorPlaneacion
var dGP = new Filter();
// comprador, de momento quedara como el planeador para no meter ruido
// coordinador de precios
var dC = new Filter();
// GC
var dCP = new Filter();
// DC
var dGC = new Filter();

function TipoTarea(){
	this.id;
	this.name;
	this.followingTask;
	this.followingTaskStatus;
	this.actions = [];
	this.role;
	this.filters = [];
}

function Filter(){
	this.prefixFilter;
	this.filterTitle;
}

function AccionesTarea(){
	this.funcction;
	this.buttonValue;
}

function loadFilters(){
	var task = getTaskByRole(user);
	var validFilters = (task != undefined && task.filters != undefined);
	if(validFilters){
		var rowIndex = 0;
		var table = document.getElementById("idFilterTab");
		table.innerHTML = "";
		var row = table.insertRow(rowIndex++);
		var cell = row.insertCell(0);
		cell.style.color = "#5f6867";
		cell.style.padding = ".3em 1em";
		cell.style.background = "#F2F2F2";
		cell.style.borderTopLeftRadius = "1em";
		cell.style.borderTopRightRadius = "1em";
		cell.innerHTML = "DETALLE";
		cell.colSpan = "4";
		var f;
		for(f in task.filters){
			var filter = task.filters[f];
			addFilterRow(filter, table, rowIndex);
		}
	}else{
		return;
	}
}

function addFilterRow(filter, table, index){
	var cellIndex = 0;
	var row = table.insertRow(index);
	row.style.background = "#F2F2F2";
	var cell = row.insertCell(cellIndex++);
	cell.innerHTML = filter.filterTitle;
	var img;
	var sub;
	cell = row.insertCell(cellIndex++);
	img = createImage("img/enCurso.png");
	cell.appendChild(img);
	sub = createSubIndex(filter.prefixFilter, "Curso");
	cell.appendChild(sub);
	cell = row.insertCell(cellIndex++);
	img = createImage("img/urgentes.png");
	cell.appendChild(img);
	sub = createSubIndex(filter.prefixFilter, "Urgente");
	cell.appendChild(sub);
	cell = row.insertCell(cellIndex++);
	img = createImage("img/quemadas.png");
	cell.appendChild(img);
	sub = createSubIndex(filter.prefixFilter, "Quemada");
	cell.appendChild(sub);
}

function createImage(source){
	var img = document.createElement("img");
	img.height="20";
	img.width="20";
	img.style.cursor = "pointer";
	img.onclick = filtra;
	img.src = source;
	return img;
}

function createSubIndex(prefix, sufix){
	var sub = document.createElement("sub");
	var id = (prefix + sufix);
	sub.id = id;
	sub.innerHTML = 0;
	sub.style.padding = ".1em .2em";
	return sub;
}

function getTaskByRole(role){
	var a;
	for(a in mapaTareas){
		var tsk = mapaTareas[a];
		var isRole = (tsk.role == role);
		if(isRole){
			return tsk;
		}
	}
}

(function() {
	loadGeneralActions();
	createNewTaskType("P", "Autorizacion de planeacion", "GP", "", "planeador", [au, rechazo], [todas, asig, prov, formAut, rechazo, nuevas]);
	createNewTaskType("GP", "Autorizacion de gerencia de planeacion", "DP", "plan", "gerenteP", [au, rechazo, redir], [todas, redireccionadas, rechazo, delPlaneador]);
	createNewTaskType("DP", "Autorizacion de direccion de planeacion", "DO", "dgp", "directorP", [aubad, rechazo, cyeDDG], [todas, dGP]);
	createNewTaskType("C", "Autorizacion de comprador", "CP", "comprador", "", [au, rechazo, cargaDocs], [todas, asig, prov, formAut, rechazo, nuevas]);
	createNewTaskType("CP", "Autorizacion de coordinador de precios", "GC", "dc", "coordinador", [au, rechazo, auDocs, dChkLst], [todas, dC]);
	createNewTaskType("GC", "Autorizacion de gerente de compras", "DC", "dcp", "gerenteC", [au, rechazo, redir], [todas, dCP]);
	createNewTaskType("DC", "Autorizacion de direccion de compras", "DO", "dgc", "directorC", [aubad, rechazo, redir], [todas, dGC]);
})();

function createNewTaskType(id, name, followingTask, followingTaskStatus, role, actions, filters){
	var newTT = new TipoTarea();
	newTT.id = id;
	newTT.name = name;
	newTT.followingTask = followingTask;
	newTT.followingTaskStatus = followingTaskStatus;
	newTT.role = role;
	newTT.actions = actions;
	newTT.filters = filters;
	mapaTareas.push(newTT);
}

function loadGeneralActions(){
	rechazo.buttonValue = "Rechazar";
	rechazo.funcction = rechazar;
	au.buttonValue = "Autorizar";
	au.funcction = autorizar;
	aubad.buttonValue = "Autorizar";
	aubad.funcction = authorizationByArmDirector;
	redir.buttonValue = "Redireccionar";
	redir.funcction = redireccionar;
	cargaDocs.buttonValue = "Cargar documentos";
	cargaDocs.funcction = loadDocuments;
	auDocs.buttonValue = "Revision de documentos";
	auDocs.funcction = docsReview;
	dChkLst.buttonValue = "Descargar checklist";
	dChkLst.funcction = descargaChecklist;
	cyeDDG.buttonValue = "Consultar y editar documento de DG";
	cyeDDG.funcction = checkAndEditDGDoc;

	todas.prefixFilter = "todas";
	todas.filterTitle	= "Todas";
	nuevas.prefixFilter = "nuevas";
	nuevas.filterTitle	= "Nuevas";
	rechazo.prefixFilter = "rechazo";
	rechazo.filterTitle = "Rechazadas";
	prov.prefixFilter = "prov";
	prov.filterTitle = "Del proveedor";
	formAut.prefixFilter = "formAut";
	formAut.filterTitle = "Formato Autorizado";
	asig.prefixFilter = "asig";
	asig.filterTitle = "Por asignacion";
	delPlaneador.prefixFilter = "plan";
	delPlaneador.filterTitle = "Del planeador";
	redireccionadas.prefixFilter = "redir";
	redireccionadas.filterTitle = "Redireccionadas";
	dGP.prefixFilter = "dgp";
	dGP.filterTitle = "Del gerente de planeacion";
	dC.prefixFilter = "dc";
	dC.filterTitle = "Del comprador";
	dCP.prefixFilter = "dcp";
	dCP.filterTitle = "Del coordinador de precios";
	dGC.prefixFilter = "dgc";
	dGC.filterTitle = "Del Gerente de compras";

}

function redireccionar(){
	alert("redireccionar");
}

function loadDocuments(){
	alert("loadDocuments");
}

function docsReview(){
	alert("docsReview");
}

function descargaChecklist(){
	alert("descargaChecklist");
}

function checkAndEditDGDoc(){
	alert("checkAndEditDGDoc");
}

function rechazar(){
	var r = "";
	while(r == ""){
		r = prompt("Indique motivo de rechazo");
		if(r == null){
			return;
		}
		if(r == ""){
			alert("en rechazo el motivo es obligatorio");
		}
	}
	alert("Se marcara la orden de compra como rechazada");
}

function authorizationByArmDirector(){
	alert("este debera validar si el otro brazo ya se completo antes de pasar a la siguiente tarea");
	return;
	// autorizar();
}

function autorizar(){
	// false si es rojo  dameEvalSemOC_SOC,  si es rojo solicitar nota
	var po = document.getElementById("idPoAtencion").innerHTML;
	var task = document.getElementById("ocTaskId").value;
	var a;
	for(a in ordenesCompra){
		var currPO = ordenesCompra[a];
		var isCurrentPO = (currPO.i == po);
		if(isCurrentPO){
			var newTasks = new Array();
			for(var b = 0; currPO.indexCurrentTask.length > b; b++){
				var ixCurrTsk = currPO.indexCurrentTask[b];
				var isCurrTsk = (ixCurrTsk != task);
				if(isCurrTsk){
					newTasks.push(ixCurrTsk);
				}
			}
			var idCurrTask = currPO.tarea[task].idTipoTarea;
			var tipoT = obtieneTipoTareaPorId(idCurrTask);
			var cveT = tipoT.followingTask;
			var tarea = creaTareaPorCve(cveT);
			var taskId = currPO.tarea.push(tarea);
			var indxPushed = (taskId - 1);
			newTasks.push(indxPushed);
			currPO.indexCurrentTask = newTasks;
			var newTskType = obtieneTipoTareaPorId(cveT);
			currPO.ultimoTipoMovimiento = newTskType.followingTaskStatus;
			alert("Su orden de compra ha sido autorizada");
			saveScreenshot();
			showTray();
			break;
		}
	}
}

function creaTareaPorCve(cveTarea){
	var newTarea = new Tarea();
	var tipoT = obtieneTipoTareaPorId(cveTarea);
	newTarea.nombre = tipoT.name;
	newTarea.role = tipoT.role;
	newTarea.fechaAsignacion = new Date();
	newTarea.idTipoTarea = cveTarea;
	return newTarea;
}

function obtieneTipoTareaPorId(idTarea){
	for(var a = 0; mapaTareas.length > a; a++){
		if(mapaTareas[a].id == idTarea){
			return mapaTareas[a];
		}
	}
}