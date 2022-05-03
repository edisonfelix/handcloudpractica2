const express = require('express')
const app = express.Router()
const ApiModel = require('../../models/permisos/api.model')

app.post('/',async (req,res) =>{

try {

    const body = req.body;
    const bodyApi = new ApiModel(body);
    const err = bodyApi.validateSync();
    if(err) {
        return res.status(400).json(
            {ok:false, 
                msg:'Uno o mas campos no se registraron',
                cont:{err}
            })
    }

    if(!(bodyApi.strMetodo == 'GET' || bodyApi.strMetodo == 'POST' || bodyApi.strMetodo == 'PUT' || bodyApi.strMetodo == 'DELETE')){
        return res.status(500).json(
            {ok:false, 
                msg:'El strMetodo no es valido',
                cont:{metodosPermitidos:['GET','POST','PUT','DELETE']}
            })
    }
    
    const encontroApi = await ApiModel.findOne({strRuta: bodyApi.strRuta,strMetodo:bodyApi.strMetodo},{strRuta:1,strDescripcion:1})

    if(encontroApi){
        return res.status(400).json(
            {ok:false, 
                msg:'El api ya se encuentra registrado',
                cont:{encontroApi}
            })
    }

    const registraApi = await bodyApi.save()

    return res.status(200).json(
        {ok:true, 
            msg:'El api se registro con exito',
            cont:{registraApi}
        })
    
} catch (error) {
    return res.status(500).json(
        {ok:false, 
            msg:'Error de servidor',
            cont:{error}
        })
}

})


module.exports = app;