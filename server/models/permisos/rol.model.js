const mongoose = require('mongoose')

let schemaRol = new mongoose.Schema({

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

    arrObjIdApis:[]
    

})

module.exports = mongoose.model('rol',schemaRol)