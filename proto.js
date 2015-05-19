var user = "";
var imgEnCurso = "img/enCurso.png";
var imgUrgente = "img/urgentes.png";
var imgQuemada = "img/quemadas.png";

(function() {
	/* */
})();

function inicializaOrdenesCompra(){
	var ordenes = window.localStorage.getItem("ocs");
	if(ordenes == null){
		creaOrdenes();
	}else{
		armaOrdenes();
	}
}

function Tarea(){
	this.nombre;
	this.role;
	this.fechaAsignacion = new Date();
	this.idTipoTarea;
	this.nota;
}

function Proveedor(){
}

function Producto(){
}

function login(){
	var usr = document.getElementById("idUser").value;
	var pass = document.getElementById("idPass").value;
	var logInValido = (usr == "" || pass == "");
	if(logInValido){
		alert("Debe ingresar ambos datos de acceso");
		return;
	}
	user = usr;
	var coordinador = (user == "coordinador");
	if(coordinador){
		document.getElementById("idCoordinadorPreciosDiv").style.display = "block";
	}else{
		document.getElementById("idCoordinadorPreciosDiv").style.display = "none";
	}
	document.getElementById("usrHead").innerHTML = usr;
	window.localStorage.setItem("usr", usr);
	showTray();
	document.getElementById("1").style.display = "block";
	document.getElementById("2").style.display = "block";
	document.getElementById("3").style.display = "inline-block";
	document.getElementById("4").style.display = "inline-block";
	document.getElementById("5").style.display = "none";
	document.getElementById("6").style.display = "none";
	ocultaBotonesDetalle();
	muestraBotonesBandeja();
	document.getElementById("buttonsId").style.display = "none";
}

/**
 * filter
 * ignoreConditions -> Boolean para utilizarse en el dashboard
 */
function loadTray(filter, ignoreConditions){
	clearDetailSearch();
	loadFilters();
	document.getElementById("ocs").innerHTML = "";
	var rowIndex = 0;
	var ocs = ordenesCompra.length;
	for(var b = 0; b < ocs; b++){
		var oc = ordenesCompra[b];
		var tareas = oc.indexCurrentTask.length;
		for(var a = 0; a < tareas; a++){
			var taskIndex = oc.indexCurrentTask[a];
			if(oc.tarea[taskIndex].role == user){
				// tipos tareas 
				// prov			Del Proveedor
				// formAut		Formato Autorizado
				// nuevas		Nuevas
				// asig			Por Asignación
				// rechazo		Rechazadas
				// todas		Todas
				var idSubIndex = "";
				var todas = "todas";
				if(oc.ultimoTipoMovimiento == undefined){
					idSubIndex = "nuevas";
				}else{
					idSubIndex = oc.ultimoTipoMovimiento;
				}
				if(oc.status == imgEnCurso || oc.status == undefined){
					idSubIndex += "Curso";
					todas += "Curso";
				}else if(oc.status == imgUrgente){
					idSubIndex += "Urgente";
					todas += "Urgente";
				}else if(oc.status == imgQuemada){
					idSubIndex += "Quemada";
					todas += "Quemada";
				}
				if (ignoreConditions != undefined && ignoreConditions) {
					addTaskToTray(oc, taskIndex, rowIndex++);
				} else {
					var el = document.getElementById(idSubIndex);
					if(el == undefined || el == null){
						continue;
					}
					var oldVal = el.innerHTML;
					el.innerHTML = (new Number(oldVal) + 1);
					var oldTVal = document.getElementById(todas).innerHTML;
					document.getElementById(todas).innerHTML = (new Number(oldTVal) + 1);
					if(filter == undefined || filter == idSubIndex || filter == todas){
						if(filter != undefined){
							document.getElementById(filter).style.background = "rgb(174, 196, 210)";
							document.getElementById(filter).style.borderRadius = ".5em";
							document.getElementById(filter).style.padding = ".1em .2em";
						}
						addTaskToTray(oc, taskIndex, rowIndex++);
					}
				}
			}
		}
	}
}

function clearDetailSearch(){
	var totals = document.getElementsByTagName("sub");
	var totalsInt = totals.length;
	for(var a = 0; totalsInt > a; a++){
		totals[a].innerHTML = 0;
	}
}

function filtra(){
	var filter = event.toElement.nextElementSibling.id;
	var withValues = (event.toElement.nextElementSibling.innerHTML != 0);
	if(withValues){
		loadTray(filter);
		event.toElement.nextElementSibling.style.background = "rgb(174, 196, 210)";
		event.toElement.nextElementSibling.style.borderRadius = "1em";
		event.toElement.nextElementSibling.style.padding = ".1em .2em";
	}else{
		alert("No existen ordenes de compra por ese filtro");
	}
} 

function muestraDetalle(){
	var poId = this.firstChild.value;
	var oc;
	for(var a = 0; a < ordenesCompra.length; a++){
		if(ordenesCompra[a].i == poId){
			oc = ordenesCompra[a];
			break;
		}
	}
	document.getElementById("idCheckUrgente").checked = (oc.status == imgUrgente);
	document.getElementById("idPoAtencion").innerHTML = poId;
	despliegaDetalleOrdenCompra(poId);
	despliegaEncabezadoOrdenCompra(poId)
	document.getElementById("ocTaskId").value = this.children[1].value;
	document.getElementById("usrHead").style.cursor = "pointer";
	document.getElementById("idTask").style.display = "inherit";
	document.getElementById("taskId").innerHTML = "Autorizacion planeacion";
	cargarBotones();
	document.getElementById("buttonsId").style.display = "block";
	document.getElementById("5").style.display = "block";
	document.getElementById("3").style.display = "none";
	document.getElementById("4").style.display = "none";
	muestraBotonesDetalle();
	ocultaBotonesBandeja();
}

function cargarBotones(){
	document.getElementById("buttonsId").innerHTML = "";
	var po = document.getElementById("idPoAtencion").innerHTML;
	var oc = obtieneOcPorNumeroOc(po);
	var idCurrentTask = document.getElementById("ocTaskId").value;
	var task = oc.tarea[idCurrentTask];
	var idTT = task.idTipoTarea;
	if(idTT == undefined){
		return;
	}
	var tarea = obtieneTipoTareaPorId(idTT);
	var tareasLength = tarea.actions.length;
	for(var a = 0; tareasLength > a; a++){
		var button = document.createElement("input");
		button.type = "button";
		button.value = tarea.actions[a].buttonValue;
		button.onclick = tarea.actions[a].funcction;
		button.style.fontSize = "1.4em";
		document.getElementById("buttonsId").appendChild(button);
	}
}

function logout(){
	document.getElementById("idUser").value = "";
	document.getElementById("idPass").value = "";
	document.getElementById("1").style.display = "none";
	document.getElementById("2").style.display = "none";
	document.getElementById("3").style.display = "none";
	document.getElementById("4").style.display = "none";
	document.getElementById("5").style.display = "none";
	document.getElementById("6").style.display = "block";
	window.localStorage.removeItem("usr");
}

function showTray(){
	loadTray();
	document.getElementById("usrHead").style.cursor = "default";
	document.getElementById("idTask").style.display = "none";
	document.getElementById("buttonsId").style.display = "none";
	ocultaBotonesDetalle();
	muestraBotonesBandeja();
	document.getElementById("5").style.display = "none";
	document.getElementById("3").style.display = "inline-block";
	document.getElementById("4").style.display = "inline-block";
}

function markUrgent(){
	var check = document.getElementById("idCheckUrgente").checked;
	document.getElementById("idCheckUrgente").checked = !check;
	var po = document.getElementById("idPoAtencion").innerHTML;
	var ordenes = ordenesCompra.length;
	for(var i = 0; i < ordenes; i++){
		var numOc = ordenesCompra[i].i;
		if(numOc == po){
			if(ordenesCompra[i].status == imgQuemada){
				document.getElementById("idCheckUrgente").checked = false;
				alert("Esta orden de compra esta marcada como quemada, no se realizara cambio de estado");
				return;
			}
			var motivoUrgente = "";
			while(motivoUrgente == ""){
				motivoUrgente = prompt("Motivo para marcar como urgente");
				if(motivoUrgente == ""){
					alert("Debe ingresar un motivo de urgente");
				}else if(motivoUrgente == null){
					return;
				}
			}
			ordenesCompra[i].status = (check) ? imgUrgente : imgEnCurso;
		}
	}
	saveScreenshot();
}

function addTaskToTray(oc, taskIndex, rowIndex){
	var hidden = document.createElement("input");
	hidden.type = "hidden";
	hidden.value = oc.i;
	var hiddenTaskId = document.createElement("input");
	hiddenTaskId.type = "hidden";
	hiddenTaskId.value = taskIndex;
	var tabla = document.createElement('table');
	var row0 = tabla.insertRow(0);
	var row1 = tabla.insertRow(1);
	row0.style.border = "none";
	row1.style.border = "none";

	
	var cell0 = row0.insertCell(0);
	cell0.rowSpan = "2";
	cell0.style.width = "2em";
	
	var cell1 = row0.insertCell(1);
	cell1.rowSpan = "2";
	cell1.style.width = "2em";
	
	var cell2 = row0.insertCell(2);
	cell2.style.color="#09C"; 
	cell2.style.fontWeight="bold";
	cell2.style.padding="0em";
	cell2.align="left";
	
	var cell3 = row1.insertCell(0);
	cell3.style.fontSize = ".8em";
	cell3.style.padding="0em";
	cell3.align="left";
	
		
	var cellz = row0.insertCell(3);
	cellz.rowSpan = "2";
	cellz.style.width = "2em";
	
	cell0.innerHTML = (rowIndex + 1);
	
	var img = document.createElement("img");
	img.src = (oc.status == undefined) ? imgEnCurso : oc.status;
	img.width = "20";
	img.height = "20";
	cell1.appendChild(img);
	
	var proveedor = dameProveedor(oc.v);
	var dataProv 	= '[' + oc.v + ']&nbsp;' + (esNulo(proveedor) ?  'Proveedor Desconocido' : 	proveedor.n + ' ( ' + proveedor.p + ') '); 
	
	cell2.innerHTML = oc.i + ' - <span class="textoMini">' + dataProv + '</span>:&nbsp;<span class="textoMaxi">' + oc.tarea[taskIndex].nombre + '</span>';
	cell3.innerHTML = oc.tarea[taskIndex].fechaAsignacion.toLocaleString();
	
	var imgSem = document.createElement("img");
	imgSem.src = 'img/' + dameSemaforoOC_SOC(oc.i);
	imgSem.width = "16";
	imgSem.height = "16";
	cellz.appendChild(imgSem);
	
	tabla.style.border = "none";
	var row = document.getElementById("ocs").insertRow(rowIndex);
	var cel = row.insertCell(0);
	cel.style.cursor = "pointer";
	cel.ondblclick = muestraDetalle;
	cel.appendChild(hidden);
	cel.appendChild(hiddenTaskId);
	cel.appendChild(tabla);
}

function saveScreenshot(){
	var ocsString = JSON.stringify(ordenesCompra);
	window.localStorage.setItem("ocs", ocsString);
}

function armaOrdenes(){
	var ordenes = window.localStorage.getItem("ocs");
	ordenesCompra = JSON.parse(ordenes);
}

function obtieneOcPorNumeroOc(numeroOc){
	var ocL = ordenesCompra.length;
	for(var a = 0; ocL > a; a++){
		var currOC = ordenesCompra[a];
		var rightOC = currOC.i == numeroOc;
		if(rightOC){
			return currOC;
		}
	}
}
