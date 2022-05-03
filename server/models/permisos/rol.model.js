const mongoose = require('mongoose')

let schemaRol = new mongoose.Schema({

    blnEstado:{
        type: Boolean,
        default: true
    },

    strNombre:{
        type: String,
        requered:[true,'No se recibio el strNombre favor ingrese']
    },

    strDescripcion:{
        type:String,
        requered:[true,'No se recibio el strMetodo favor ingrese']
    },


    blnRolDefault:{
        type:Boolean,
        default:false
    },

    arrObjIdApis:[mongoose.Types.ObjectId]
    

})

module.exports = mongoose.model('rol',schemaRol)