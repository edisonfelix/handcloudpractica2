const mongoose = require('mongoose')

let schemaApi = new mongoose.Schema({

    blnEstado:{
        type: Boolean,
        default: true
    },

    strRuta:{
        type: String,
        requered:[true,'No se recibio el strRuta favor ingrese']
    },

    strMetodo:{
        type:String,
        requered:[true,'No se recibio el strMetodo favor ingrese']
    },

    strDescripcion:{
        type:String,
        requered:[true,'No se recibio el strMetodo favor ingrese']
    },

    blnEsApi:{
        type:Boolean,
        default:true
    },

    blnEsMenu:{
        type:Boolean,
        default:true
    },

    blnRolDefault:{
        type:Boolean,
        default:true
    }

})

module.exports = mongoose.model('api',schemaApi)