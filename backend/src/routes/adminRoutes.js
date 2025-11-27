import express from 'express';
import { changeStateProduct, updateProduct, createProduct } from '../controllers/productController.js'
import { upload } from '../middleware/uploadImages.js';

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

router.get('/crear', (req, res) => {

    res.render('pages/abm', {
        modo: 'crear',
        id: null
    });
});

// Deshabilitar/Habilitar producto por id
router.put('/disable/:id', changeStateProduct);

// Modificar producto
router.put('/update/:id', upload.single("imagen"), updateProduct)

// Crear producto
router.post('/create', upload.single("imagen"), createProduct);

export default router;