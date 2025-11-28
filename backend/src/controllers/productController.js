import { Productos, Discos, Libros, Categorias, Generos } from "../models/index.js";
import { Sequelize } from "sequelize";
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DESTINO_ABSOLUTO = path.join(__dirname, '..', '..', 'public', 'img', 'productos');

export const getProducts = async (req, res) => {

    try {

        const productos = await Productos.findAll(
            {
                include: [
                    {
                        model: Categorias,
                        as: 'categoria',
                        attributes: ['nombre']
                    }
                ],
                raw: true, // Esto elimina la cascada, y devuelve el objeto plano
                attributes: { exclude: ['id_categoria'] }
            },
        );

        res.send(productos);

    } catch (error) {
        console.error({ message: 'Error al obtener productos: ', error })
    }
}

export const getOneProduct = async (req, res) => {

    const { id } = req.params

    try {
        const producto = await Productos.findOne(
            {
                where: { id: id },
                include: [
                    {
                        model: Categorias,
                        as: 'categoria',
                        attributes: ['nombre']
                    },
                    {
                        model: Discos,
                        required: false,
                        as: 'info_disco',
                        attributes: ['interprete', 'year'],
                        include: [
                            {
                                model: Generos,
                                attributes: ['genero'],
                                as: 'genero'
                            }
                        ]
                    },
                    { model: Libros, required: false, as: 'info_libro', attributes: ['autor', 'editorial'], include: [{ model: Generos, attributes: ['genero'], as: 'genero' }] }
                ],
                attributes: { exclude: ['id_categoria'] }
            }
        );

        res.send(producto)
    } catch (error) {
        console.log({ message: `Error al obtener el producto id: ${id}: ${error}` })
    }
}

export const changeStateProduct = async (req, res) => {

    const { id } = req.params;

    try {

        const [response] = await Productos.update(
            // { estado: false },
            { estado: Sequelize.literal('NOT estado') },
            { where: { id } }
        );

        if (response === 0) return res.status(404).json({ message: `Producto con id: ${id} no encontrado.` });

        res.status(200).json({ message: `Producto con id: ${id} modificado correctamente!` });

    } catch (error) {
        console.log({ message: `Error al cambiar estado del producto id: ${id}: ${error}` })
    }
}

export const createProduct = async (req, res) => {

    const data = req.body;
    let tempFilename = req.file ? req.file.filename : null;

    try {

        // Verificar categoria
        const categoria = await Categorias.findOne({
            where: { nombre: data.categoria }
        });

        if (!categoria) {
            return res.status(400).json({ message: "Categoría no encontrada" });
        }

        const nuevoProducto = await Productos.create(
            {
                titulo: data.titulo,
                precio: data.precio,
                imagen: tempFilename,
                stock: data.stock,
                id_categoria: categoria.id,
                estado: data.estado
            }
        );

        if (!nuevoProducto) {
            if (tempFilename) {
                // Si hay algun error se borra el archivo temporal si existe
                fs.unlinkSync(path.join(DESTINO_ABSOLUTO, tempFilename));
            }
            return res.status(400).json({ message: "No se pudo crear producto" });
        }

        // --- LÓGICA CLAVE DE RENOMBRADO ---
        if (tempFilename) {
            const ext = path.extname(req.file.originalname);
            const newFilename = `CIL${String(nuevoProducto.id).padStart(3, "0")}${ext}`;
            
            const oldPath = path.join(DESTINO_ABSOLUTO, tempFilename);
            const newPath = path.join(DESTINO_ABSOLUTO, newFilename);

            // Renombra el archivo temporal al nombre final usando el ID
            fs.renameSync(oldPath, newPath);

            // Actualiza el registro en la DB con el nombre de archivo final
            await Productos.update(
                { imagen: `/img/productos/${newFilename}` }, 
                { where: { id: nuevoProducto.id } }
            );
        }

        // Crear info_disco 
        if (categoria.nombre == "Disco") {

            const generoDisco = await Generos.findOne({
                where: { genero: data.generoDisco }
            });

            if (!generoDisco) {
                return res.status(400).json({ message: "Género (disco) no encontrado" });
            }

            await Discos.create(
                {
                    interprete: data.interprete,
                    year: data.year,
                    id_genero: generoDisco.id_genero,
                    id_producto: nuevoProducto.id
                },
            );
        }

        //Crear info_libro
        if (categoria.nombre == "Libro") {

            const generoLibro = await Generos.findOne({
                where: { genero: data.generoLibro }
            });

            if (!generoLibro) {
                return res.status(400).json({ message: "Género (libro) no encontrado" });
            }

            await Libros.create(
                {
                    autor: data.info_libro.autor,
                    editorial: data.info_libro.editorial,
                    id_genero: generoLibro.id_genero,
                    id_producto: nuevoProducto.id
                },
            );
        }

        res.status(201).json({ message: `Nuevo producto agregado. ID autogenerado: ${nuevoProducto.id}` })

    } catch (error) {
        if (tempFilename) {
            // En caso de error tambien borramos el archivo temporal
            fs.unlinkSync(path.join(DESTINO_ABSOLUTO, tempFilename));
        }
        res.status(500).json({ message: `Error al crear producto: ${error.message}` });
    }
}

export const updateProduct = async (req, res) => {

    const data = req.body;
    const { id } = req.params
    
    let tempFilename;
    
    try {
        
        if (req.file) {
            tempFilename = `/img/productos/${req.file.filename}`;
        } else {
            tempFilename = data.imagenExistente
        }

        // Verificar categoria
        const categoria = await Categorias.findOne({
            where: { nombre: data.categoria }
        });

        if (!categoria) {
            return res.status(400).json({ message: "Categoría no encontrada" });
        }

        // Actualizar producto
        const [updated] = await Productos.update(
            {
                titulo: data.titulo,
                precio: data.precio,
                imagen: tempFilename,
                stock: data.stock,
                id_categoria: categoria.id,
                estado: data.estado
            },
            { where: { id } }
        );
        // Sino lo encuentra o no cambia nada responde 400
        if (updated === 0 && !req.file) {
            return res.status(400).json("No se modifico ningun producto");
        }

        // Actualizar info_disco si existe
        if (categoria.nombre == "Disco") {

            const generoDisco = await Generos.findOne({
                where: { genero: data.generoDisco }
            });

            if (!generoDisco) {
                return res.status(400).json({ message: "Género (disco) no encontrado" });
            }

            await Discos.update(
                {
                    interprete: data.info_disco.interprete,
                    year: data.info_disco.year,
                    id_genero: generoDisco.id_genero
                },
                { where: { id_producto: id } }
            );
        }

        //Sctualizar info_libro si existe
        if (categoria.nombre == "Libro") {

            const generoLibro = await Generos.findOne({
                where: { genero: data.generoLibro }
            });

            if (!generoLibro) {
                return res.status(400).json({ message: "Género (libro) no encontrado" });
            }

            await Libros.update(
                {
                    autor: data.autor,
                    editorial: data.editorial,
                    id_genero: generoLibro.id_genero
                },
                { where: { id_producto: id } }
            );
        }

        res.status(200).json({ message: `Producto con id: ${id} modificado correctamente!` });

    } catch (error) {
        console.log({ message: `Error al modificar producto id ${id}: ${error}` })
    }
}