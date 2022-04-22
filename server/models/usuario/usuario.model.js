const mongoose = require('mongoose');

let SchemaUsuario = mongoose.Schema({
    strNombre:{
        type: String,
        requered: [true,'No se recibio el strNombre favor de ingresarlo']    
    },
    strApellido:{
        type:String,
        requered: [true,'No se recibio el strApellido favor ingresrlo']
    },
    strEmail:{
        type: String,
        requered:[true,'No se recibio el strEmail favor ingrese']
    }
})

module.exports = mongoose.model('usuario',SchemaUsuario);