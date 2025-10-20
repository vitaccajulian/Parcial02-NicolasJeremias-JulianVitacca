// Repositorio: https://github.com/vitaccajulian/Parcial02-NicolasJeremias-JulianVitacca

const express = require('express'); 
const app = express();

const productRoutes = require('./src/routes/productRoute.js')

const PORT = process.env.PORT;

/* View Engine */
app.set('view engine', 'ejs');
app.set('views', __dirname + '/src/views');

/* Rutas */
app.get('/', (req, res) => {
    res.send("Hello Word");
});

// getAllProducts route
//app.use('/api', productRoutes);

/* Archivos Estaticos */ 
app.use(express.static('public'));

app.use((req,res) => {
    res.status(404).send('Lo sentimos, pagina no encontrada'); // ACA ARMAR EL 404
})

app.listen(PORT, () => console.log(`Servidor corriendo en puerto:${PORT}`));