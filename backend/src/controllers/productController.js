import { Productos, Discos, Libros, Categorias, Generos } from "../models/index.js";
import { Sequelize } from "sequelize";

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
            }
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
                        attributes: ['interprete', 'año'],
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

    const { titulo, precio, imagen, stock, id_categoria, estado, detalles } = req.body;
    try {

        const nuevoProducto = await Productos.create({ titulo, precio, imagen, stock, id_categoria, estado });
        const idProducto = nuevoProducto.id;

        if (id_categoria === 1) {
            await Discos.create(
                {
                    id_producto: idProducto,
                    interprete: detalles.interprete,
                    genero: detalles.genero,
                    año: detalles.año
                })
        } else if (id_categoria === 2) {
            await Libros.create(
                {
                    id_producto: idProducto,
                    autor: detalles.autor,
                    editorial: detalles.editorial,
                    genero: detalles.genero
                },
            );
        }

        res.status(201).json({ message: `Nuevo producto agregado. ID autogenerado: ${nuevoProducto.id}` })

    } catch (error) {
        res.status(500).json({ message: `Error al crear producto: ${error.message}` });
    }
}

export const updateProduct = async (req, res) => {

    const data = req.body;
    const { id } = req.params

    
    try {
        
        if(req.file) return res.status(200).json({ message: `Imagen de id: ${id} modificada correctamente!` });
        
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
                imagen: data.imagen,
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
        if (data.info_disco) {

            const generoDisco = await Generos.findOne({
                where: { genero: data.generoDisco }
            });

            if (!generoDisco) {
                return res.status(400).json({ message: "Género (disco) no encontrado" });
            }

            await Discos.update(
                {
                    interprete: data.info_disco.interprete,
                    año: data.info_disco.año,
                    id_genero: generoDisco.id_genero
                },
                { where: { id_producto: id } }
            );
        }

        //Sctualizar info_libro si existe
        if (data.info_libro) {

            const generoLibro = await Generos.findOne({
                where: { genero: data.generoLibro }
            });

            if (!generoLibro) {
                return res.status(400).json({ message: "Género (libro) no encontrado" });
            }

            await Libros.update(
                {
                    autor: data.info_libro.autor,
                    editorial: data.info_libro.editorial,
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