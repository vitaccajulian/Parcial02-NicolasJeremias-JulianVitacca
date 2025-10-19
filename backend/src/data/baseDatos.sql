-- =============================================
--  CREACIÓN DE BASE DE DATOS
-- =============================================

CREATE DATABASE IF NOT EXISTS `tpintegrador`;
USE `tpintegrador`;

-- CONSULTA:
-- SELECT * FROM productos;

-- =============================================
--  TABLA: categorias
-- =============================================
DROP TABLE IF EXISTS `categorias`;
CREATE TABLE `categorias` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`)
);

-- Carga inicial de categorías base
INSERT INTO `categorias` (`nombre`) VALUES 
('disco'),
('libro');

-- =====================================
-- 1️⃣ Tabla PRODUCTOS (Tabla padre)
-- =====================================
DROP TABLE IF EXISTS `productos`;
CREATE TABLE `productos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `titulo` VARCHAR(100) NOT NULL,
  `precio` DOUBLE NOT NULL,
  `imagen` VARCHAR(150) NULL,
  `stock` INT DEFAULT 0,
  `category` VARCHAR(45) NOT NULL,  -- 'libro', 'disco', 'vinilo', etc.
  status BOOLEAN DEFAULT TRUE
);

-- =====================================
-- 2️⃣ Tabla LIBROS (actualizada)
-- =====================================
DROP TABLE IF EXISTS `libros`;
CREATE TABLE `libros` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_producto` INT NOT NULL,
  `autor` VARCHAR(100) NOT NULL,
  `editorial` VARCHAR(45) NULL,
  `genero` VARCHAR(45) NULL,
  FOREIGN KEY (`id_producto`) REFERENCES `productos`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- =====================================
-- 3️⃣ Tabla DISCOS (actualizada)
-- =====================================
DROP TABLE IF EXISTS `discos`;
CREATE TABLE `discos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_producto` INT NOT NULL,
  `interprete` VARCHAR(100) NOT NULL,
  `genero` VARCHAR(45) NULL,
  `año` INT NULL,
  FOREIGN KEY (`id_producto`) REFERENCES `productos`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- =====================================
-- 4️⃣ Tabla VENTAS (cabecera)
-- =====================================
DROP TABLE IF EXISTS `ventas`;
CREATE TABLE ventas (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `cliente` VARCHAR(100) NOT NULL,
  `fecha` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `total` DOUBLE NOT NULL
);

-- =====================================
-- 5️⃣ Tabla DETALLE_VENTA (relación venta-producto)
-- =====================================
DROP TABLE IF EXISTS `detalle_venta`;
CREATE TABLE `detalle_venta` (
  `id_venta` INT NOT NULL,
  `id_producto` INT NOT NULL,
  `cantidad` INT DEFAULT 1,
  `precio_unitario` DOUBLE NOT NULL,
  FOREIGN KEY (`id_venta`) REFERENCES `ventas`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (`id_producto`) REFERENCES `productos`(`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- =====================================
-- 6️⃣ Tabla ADMINISTRADORES
-- =====================================
DROP TABLE IF EXISTS `administradores`;
CREATE TABLE `administradores` (
  `id` INT PRIMARY KEY,
  `usuario` VARCHAR(45) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL
);
