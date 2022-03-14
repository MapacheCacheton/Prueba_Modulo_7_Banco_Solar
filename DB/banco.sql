DROP DATABASE IF EXISTS bancosolar;
CREATE DATABASE bancosolar;

\c bancosolar;

CREATE TABLE usuarios(
    id SERIAL,
    nombre VARCHAR(50),
    balance FLOAT CHECK (balance >= 0),
    PRIMARY KEY (id)
);

CREATE TABLE transferencias(
    id SERIAL,
    emisor INT,
    receptor INT,
    monto FLOAT, 
    fecha TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (emisor) REFERENCES usuarios(id),
    FOREIGN KEY (receptor) REFERENCES usuarios(id)
);