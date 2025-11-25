import express from 'express';
import { disableProduct, updateProduct, createProduct } from '../controllers/productController.js'

const router = express.Router();

router.get('/dashboard', (req, res) => {
    res.render('pages/admin');
});

router.get('/editar/:id', (req, res) => {

    res.render('pages/abm', {
        modo: 'editar',
        id: req.params.id
    });
});

// Deshabilitar producto por id
router.put('/:id', disableProduct);

// Modificar producto
router.put('/update/id', updateProduct)

// Crear producto
router.post('/create', createProduct);

export default router;