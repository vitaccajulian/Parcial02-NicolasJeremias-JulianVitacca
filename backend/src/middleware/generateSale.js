import { Productos } from "../models/index.js";

export const generateSale = async (req, res, next) => {

    const { detalle } = req.body

    try {
        
        let total = 0;
        await Promise.all(detalle.map(async element => {

            const producto = await Productos.findOne({ where: { id: element.id_producto } });
            if (!producto) throw new Error('Producto no encontrado');


            element.precio_unitario = producto.precio

            total += element.precio_unitario * element.cantidad
            
        }));
        
        req.body.total = total;
        req.body.detalle = detalle;

        next();

    } catch (error) {
        res.status(500).json({ message: 'Error al generar la venta', error: error.message });
    }
}
