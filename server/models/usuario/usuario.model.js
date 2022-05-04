const mongoose = require('mongoose');

let SchemaUsuario = mongoose.Schema({
    blnEstado:{
            type: Boolean,
            requered: [true,'No se recibio el blnEstado favor ingresrlo']
        },

    strNombre:{
        type: String,
        default: true    
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
    },

    _idEmpresa:{
        type: mongoose.Types.ObjectId,
        requered:[true,'No se recibio el idEmpresa favor ingrese']
    },

    strImagen:{
        type: String,
        default:'default.jpg'
    },

    _idObjRol:{
        type: mongoose.Types.ObjectId
    }

    
})

module.exports = mongoose.model('usuario',SchemaUsuario);