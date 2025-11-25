// Repositorio: https://github.com/vitaccajulian/Parcial02-NicolasJeremias-JulianVitacca

import express from 'express';

// Define __dirname para el ámbito de módulos de ES
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { sequelize } from './src/database/index.js';
import { seedData } from './src/database/initData.js';

import productRoutes from './src/routes/productRoute.js';
import salesRoute from './src/routes/salesRoute.js';
import adminRoutes from './src/routes/adminRoutes.js'
import authRoutes from './src/routes/authRoutes.js'
import {generatePdf} from './src/middleware/downloadTicket.js'

const app = express();
const PORT = process.env.PORT;

import cors from 'cors';

app.use(cors({
    origin: '*'
}))

/* View Engine */
app.set('view engine', 'ejs');
app.set('views', './src/views');

/* Middlewares */
app.use(express.json());
// Verifica la cookie para iniciar/mantener sesion
import { verificarToken } from "./src/middleware/verifyToken.js";
// CookieParser 
import cookieParser from 'cookie-parser';
app.use(cookieParser());

/*  API Routes */
app.use('/api/productos', productRoutes);
app.use('/api/ventas', salesRoute);

app.use('/auth', authRoutes);

/* Admin Routes */
// app.use('/admin', verificarToken, adminRoutes); // Salteo el acceso para testear la pagina EJS
app.use('/admin', adminRoutes);

app.use('/print', generatePdf)

/* Archivos Estaticos */
app.use(express.static(path.join(__dirname, 'public')));
// Esta ruta es para utilizar la carpeta del frontend. Si se usara la carpeta public del server no seria necesario
app.use('/frontend', express.static(path.join(__dirname, '..', 'frontend')));

app.use((req, res) => {
    res.status(404).send('Lo sentimos, pagina no encontrada'); // ACA ARMAR EL 404
})

sequelize
    .sync({ force: true }) // El .sync se podria poner en seedData?
    .then(() => seedData())
    .then(() => {
        app.listen(PORT, () => {
            console.log(`El servidor corriendo en puerto: ${PORT} |=|=| http://localhost:${PORT}/`);
        });
    })
    .catch((error) => {
        console.log({ error });
    });