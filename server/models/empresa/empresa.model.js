const mongoose = require('mongoose');

let SchemaEmpresa = mongoose.Schema({
    blnEstado:{
        type: Boolean,
        default:true
    },
    strNombre:{
        type: String,
        requered: [true,'No se recibio el strNombre favor de ingresarlo']    
    },
    strDescripcion:{
        type:String,
        requered: [true,'No se recibio el strDescripcion favor ingresrlo']
    },
    nmbTelefono:{
        type: Number,
        requered:[true,'No se recibio el nmbTelefono favor ingrese']
    },
    nmbCodigoPostal:{
        type: Number,
        requered:[true,'No se recibio el nmbCodigoPostal favor ingrese']
    },
    strCiudad:{
        type:String,
        requered: [true,'No se recibio el strCiudad favor ingresrlo']
    }

})

module.exports = mongoose.model('empresa',SchemaEmpresa);