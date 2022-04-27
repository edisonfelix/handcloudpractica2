const mongoose = require('mongoose');

let SchemaProducto = mongoose.Schema({
    blnEstado:{
        type: Boolean,
        requered: [true,'No se recibio el blnEstado favor de ingresarlo']
    },
    strNombre:{
        type: String,
        requered: [true,'No se recibio el strNombre favor de ingresarlo']    
    },
    strDescripcion:{
        type:String,
        requered: [true,'No se recibio el strDescripcion favor ingresrlo']
    },
    nmbPrecio:{
        type: Number,
        requered:[true,'No se recibio el nmbPrecio favor ingrese']
    }
})

module.exports = mongoose.model('producto',SchemaProducto);