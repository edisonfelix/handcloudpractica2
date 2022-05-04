const mongoose = require('mongoose')

let schemaApi = new mongoose.Schema({

    blnEstado:{
        type: Boolean,
        default: true
    },

    strRuta:{
        type: String,
        required:[true,'No se recibio el strRuta favor ingrese']
    },

    strMetodo:{
        type:String,
        required:[true,'No se recibio el strMetodo favor ingrese']
    },

    strDescripcion:{
        type:String,
        required:[true,'No se recibio el strMetodo favor ingrese']
    },

    blnEsApi:{
        type:Boolean,
        default:true
    },

    blnEsMenu:{
        type:Boolean,
        default:true
    }

    

})

module.exports = mongoose.model('api',schemaApi)