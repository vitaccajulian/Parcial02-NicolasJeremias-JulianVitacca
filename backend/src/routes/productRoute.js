const express = require('express');
const router = express.Router();
const productController = require('../controllers/product/GetProductController.js');

router.get('/products', productController.getOneProduct);

module.exports = router;