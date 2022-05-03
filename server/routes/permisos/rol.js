const express = require('express')
const rolModel = require('../../models/permisos/rol.model')
const app = express.Router()
const RolModel = require('../../models/permisos/rol.model')

app.get('/', async (req,res) => {

    const blnEstado = req.query.blnEstado == "false" ? false : true;
    const obtenerRol = await rolModel.aggregate([{  
        $match: {blnEstado:blnEstado}
      },{
          $lookup:{
              from: 'apis',
              let: {arrObjIdApis:'$arrObjIdApis'},
              pipeline:[
                {$match:{$expr:{$in:['$_id','$$arrObjIdApis']}}},
              ],
              as: 'apis'
          }
      }])

    res.status(200).json({
        ok: true,
        msg: 'Se obtuvieron los roles exitosamente',
        cont:{
            obtenerRol
        }
    })


})

app.post('/', async (req,res) =>{

const body = req.body
const bodyRol = new RolModel(body)
const err = bodyRol.validateSync();

if(err) {
    return res.status(400).json(
        {ok:false, 
            msg:'Uno o mas campos no se registraron',
            cont:{err}
        })
}

if(!bodyRol.arrObjIdApis)
return res.status(400).json(
    {ok:false, 
        msg:'Uno o más campos no se registrarón, favor registre',
        cont:{arrObjIdApis:null}
    })


const encontroRol = await rolModel.findOne({strNombre:bodyRol.strNombre},{strNombre:1})

if(encontroRol){
    return res.status(400).json(
        {ok:false, 
            msg:'El api ya se encuentra registrado',
            cont:{encontroRol}
        })
}

const registroRol = await bodyRol.save()

return res.status(200).json(
    {ok:true, 
        msg:'El rol se registro con exito',
        cont:{registroRol}
    })

})

module.exports = app;