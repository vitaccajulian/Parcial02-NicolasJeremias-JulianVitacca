import express from 'express';

const router = express.Router();

router.get('/ingresar', (req, res) => {
    res.render('pages/login', {
        modo: 'login',
        paginaActual: 'login',
        email: process.env.EMAIL_TEST,
        password: process.env.PASSWORD_TEST
    });
});

export default router;