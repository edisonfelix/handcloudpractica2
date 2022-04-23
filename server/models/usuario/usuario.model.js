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
    },

    strDireccion:{
        type: String,
        requered:[true,'No se recibio el strDirección favor ingrese']
    },

    strNombreUsuario:{
        type: String,
        requered:[true,'No se recibio el strNombreUsuario favor ingrese']
    },

    strContrasena:{
        type: String,
        requered:[true,'No se recibio el strContrasena favor ingrese']
    }

    
})

module.exports = mongoose.model('usuario',SchemaUsuario);