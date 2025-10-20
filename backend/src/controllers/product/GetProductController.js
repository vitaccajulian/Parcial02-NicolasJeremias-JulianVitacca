const getOneProduct = require('../../dao/getOneProduct');


getOneProduct(1,(error, results, fields) => { // HAY QUE MODIFICAR LOS PARAMETROS
    console.log(results); // ACA TIENE QUE DEVOLVER LA RESPUESTA A LAS RUTAS
});

module.exports = { getOneProduct };