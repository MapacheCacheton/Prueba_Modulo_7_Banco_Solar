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


SELECT * FROM transferencias;

SELECT u.nombre AS emisor, us.nombre AS receptor, monto, fecha FROM transferencias AS t 
INNER JOIN usuarios AS u ON u.id = t.emisor 
INNER JOIN usuarios AS us ON us.id = t.receptor;  