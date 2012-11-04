CREATE TABLE linea(
	id_linea varchar(2) not null primary key,
	nombre varchar(50) not null,
	distancia decimal(4,2) not null,
	velocidadmedia decimal(4,2) not null,
	activa char(2) default 'NO'
);

CREATE TABLE ruta_linea(
	id_ruta_linea int not null primary key auto_increment,
	id_linea varchar(2) not null,
	dia varchar(1) not null, 
	hora time not null,
	latitud decimal(18,16) not null,
	longitud decimal(18,16) not null,
	foreign key(id_linea) references linea(id_linea) on delete cascade on update cascade
);

CREATE TABLE nodos_linea(
	id_linea varchar(2) not null,
	id_nodo int not null,
	latitud decimal(18,16) not null,
	longitud decimal(18,16) not null,
	foreign key(id_linea) references linea(id_linea) on delete cascade on update cascade,
	primary key (id_linea, id_nodo, latitud, longitud)
);

CREATE TABLE parada(
	id_parada int not null primary key auto_increment,
	nombre varchar(50) not null,
	latitudfuera decimal(18,16) not null,
	longitudfuera decimal(18,16) not null
);

CREATE TABLE parada_linea(
	id_parada int not null,
	id_linea varchar(2) not null,
	latitud decimal(18,16) not null,
	longitud decimal(18,16) not null,
	foreign key(id_linea) references linea(id_linea) on delete cascade on update cascade,
	foreign key(id_parada) references parada(id_parada) on delete cascade on update cascade,
	primary key(id_parada, id_linea)
);






CREATE TABLE prueba_posicion(
	latitud decimal(18,16) not null,
	longitud decimal(18,16) not null
);




#############################
SELECT * FROM osmautobur.ruta_linea;
DROP TABLE osmautobur.ruta_linea;
SELECT COUNT(*) FROM osmautobur.ruta_linea;
