const connection = require('./dbConnection.js');

function getOneProduct (id, callback) {
    connection.query('SELECT * FROM `productos` WHERE `id` = ? ;', id, callback)
    
};

module.exports = getOneProduct;