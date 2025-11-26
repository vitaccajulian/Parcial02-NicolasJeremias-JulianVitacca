import express from 'express';

const router = express.Router();

router.get('/ingresar', (req, res) => {
    res.render('pages/login', { modo: 'login', paginaActual: 'login' });
});

export default router;