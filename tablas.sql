CREATE TABLE clientes (
    id INTEGER PRIMARY KEY,
    nombres VARCHAR(20) NOT NULL,
    apellidos VARCHAR(40) NOT NULL,
    telefono VARCHAR(15),
    ciudad VARCHAR(20),
    direccion VARCHAR(30),
    email VARCHAR(30)
);

CREATE TABLE productos (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL,
    categoria VARCHAR(30),
    precio NUMERIC(6,2) NOT NULL,
    disponible BOOLEAN DEFAULT TRUE
);

CREATE TABLE repartidores (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL,
    vehiculo VARCHAR(15),
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE pedidos (
    id INTEGER PRIMARY KEY,
    cliente_id INTEGER NOT NULL,
    fecha DATE NOT NULL,
    estado VARCHAR(15) DEFAULT 'pendiente',
    total NUMERIC(8,2),
    id_repartidor INTEGER,

    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (id_repartidor) REFERENCES repartidores(id)
);

CREATE TABLE detalle_pedidos (
    id INTEGER PRIMARY KEY,
    id_pedido INTEGER NOT NULL,
    id_producto INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario NUMERIC(6,2) NOT NULL,

    FOREIGN KEY (id_pedido) REFERENCES pedidos(id),
    FOREIGN KEY (id_producto) REFERENCES productos(id)
);