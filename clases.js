function Proveedor(){
	this.i;	// ID de Proveedor
	this.n;	// Nombre de Proveedor
	this.p;	// Pais
}

Proveedor.prototype.toStr = function(){ return JSON.stringify(this); }

Proveedor.prototype.setJSON = function (obJSON){
	this.i = unescapehtml(obJSON.i);
	this.n = unescapehtml(obJSON.n);
	this.p = unescapehtml(obJSON.p);
}

function Producto(){
	this.c;	// Codigo
	this.l;	// Clave de Producto
	this.d;	// Descripción de Producto
	this.p;	// Precio
	this.y;	// Cve Planeador
	this.z;	// Cve Comprador
	this.w;	// Peso
	this.v;	// Volumen
	
	this.dm;	// Dias Inv Min
	this.dx;	// Dias Inv Max
	this.dam;	// Dias Inv Arribo Min
	this.dax;	// Dias Inv Arribo Max
	this.bm;	// Bo Min
	this.bx;	// Bo Max
	this.bam;	// Bo Arribo Min
	this.bax;	// Bo Arribo Max
}
Producto.prototype.toStr = function(){ return JSON.stringify(this); }

Producto.prototype.setJSON = function (obJSON){
	this.c = unescapehtml(obJSON.c);
	this.l = unescapehtml(obJSON.l);
	this.d = unescapehtml(obJSON.d);
	this.p = unescapehtml(obJSON.p);
	
	this.y = unescapehtml(obJSON.y);
	this.z = unescapehtml(obJSON.z);
	this.w = unescapehtml(obJSON.w);
	this.v = unescapehtml(obJSON.v);
	
	this.dm  = obJSON.dm;
	this.dx  = obJSON.dx;
	this.dam = obJSON.dam;
	this.dax = obJSON.dax;
	this.bm  = obJSON.bm;
	this.bx  = obJSON.bx;
	this.bam = obJSON.bam;
	this.bax = obJSON.bax;
}

function Contacto(){
	this.i;	// Clave
	this.n;	// Nombre
}
Contacto.prototype.toStr = function(){ return JSON.stringify(this); }

Contacto.prototype.setJSON = function (obJSON){
	this.i = unescapehtml(obJSON.i);
	this.n = unescapehtml(obJSON.n);
}


/* Clase de Pedidos */
function OrdenCompra() {
		
	this.i	= null;	// Id OC
	this.s	= null;	// Id OC Secundaria
	this.p	= null;	// Cve Planeador		
	this.c	= null;	// Cve Comprador
	this.f	= null;	// Fecha OC
	this.t	= null;	// Termino de Pago
	this.e	= null;	// Condicion Envio
	this.pe	= null;	// Puerto Envio
	this.pr	= null;	// Puerto Recepcion
	this.a	= null;	// Almacen
	this.r	= null;	// Centro	
	this.v	= null;	// Proveedor	
	
	this.status;
	this.indexCurrentTask = new Array();
	this.tarea = new Array();
	this.ultimoTipoMovimiento;
		
	this.detalle = new Array();	// Items de Pedido
}
	
	OrdenCompra.prototype.getKey = function(){
		return this.i;
	};
	
	OrdenCompra.prototype.toStr	= function(){
		return JSON.stringify(this);
	};
	
	OrdenCompra.prototype.setJSON = function(obJSON){
		
		if(obJSON == null)
			return;
		this.i 	= obJSON.i;
		this.s	= obJSON.s;	
		this.p	= obJSON.p;		
		this.c	= obJSON.c;	
		this.f	= obJSON.f;	
		this.t	= obJSON.t;	
		this.e	= obJSON.e;	
		this.pe	= obJSON.pe;	
		this.pr	= obJSON.pr;	
		this.a	= obJSON.a;	
		this.r	= obJSON.r;	
		this.v  = obJSON.v;	
		this.status  = obJSON.status;	
		this.ultimoTipoMovimiento = obJSON.ultimoTipoMovimiento;
		if(obJSON.detalle != null){
			if(this.detalle == null)
				this.detalle = new Array();	
			for(var i=0;i<obJSON.detalle.length;i++){
				var de =  new OrdenCompraDetalle();
				de.setJSON(obJSON.detalle[i]);
				this.detalle.push(de);
			}
		}
		
	};
	
	/* Clase de Items de Pedidos */
	function OrdenCompraDetalle() {	
		this.p	  = null;	// Pocision	
		this.c	  = null;	// Codigo	
		this.a	  = null;	// Cantidad	
		this.di	  = null;	// Dias de Inventario	
		this.dia  = null;	// Dias de Inventario al Arribo	
		this.bo	  = null;	// BackOrder	
		this.boa  = null;	// BackOrder al Arribo	
	}
	
	OrdenCompraDetalle.prototype.getKey = function(){
		return this.p;
	};
	
	OrdenCompraDetalle.prototype.toStr	= function(){
		return JSON.stringify(this);
	};
	
	OrdenCompraDetalle.prototype.setJSON = function(obJSON){
		if(obJSON == null)
			return;	
		this.p	 = obJSON.p;
		this.c	 = obJSON.c;	
		this.a	 = obJSON.a;	
		this.di	 = (esNulo(obJSON.di)  ? -1 : obJSON.di);
		this.dia = (esNulo(obJSON.dia) ? -1 : obJSON.dia);
		this.bo	 = (esNulo(obJSON.bo)  ? -1 : obJSON.bo);
		this.boa = (esNulo(obJSON.boa) ? -1 : obJSON.boa);
	};
	



function unescapehtml(str){
	return str;
	// AQUI SE UNESQUEPEA
}