const { decode } = require('jsonwebtoken')
const jwt = require('jsonwebtoken')
require('../config/config')
require('colors')
const usuarioModel = require('../models/usuario/usuario.model')
const RolModel = require('../models/permisos/rol.model')
const permisosModel = require('../models/permisos/api.model')
const ObjectId = require('mongoose').Types.ObjectId;

const verificarAcceso = async (req,res,next) => {
 try {

    const url = req.originalUrl.split('?')
    const originalUrl = url[0]
    const originalMetodo = req.method
    console.log(originalUrl)
 
 const token = req.get('token')
 if (!token){
    console.log(`Se denego el acceso a a ruta:`,`${originalUrl}`.red)
     return res.status(400).json({
         ok: false,
         msg: 'No se recibio un token valido',
         cont:{

         }
     })
 }

 jwt.verify(token,process.env.SEED, async (err,decode) => {
     if(err){
        console.log(`Se denego el acceso a a ruta:`,`${originalUrl}`.red)
         return res.status(400).json({
             ok:false,
             msg: err.name == "JsonWebTokenError" ? 'El token es invalido' : 'El token expiro',
             cont:{
                 token
             }
         })
     }

    if(!decode.usuario){
        return res.status(500).json({
            ok:false,
            msg: 'No se recibio el identificador del usuario',
            cont:{
                usuario: decode.usuario
            }
        })
    }

     const [obtenerUsuariosAggregate] = await usuarioModel.aggregate([
         {
             $match:{blnEstado:true}
         },
         {
             $match:{_id:ObjectId(decode.usuario._id)}
         },
              
            {
                $lookup:{
                    from: RolModel.collection.name,
                    let: {idObjRol:'$_idObjRol'},
                    pipeline:[
                        {$match:{$expr:{$eq:['$_id','$$idObjRol']}}},
                        {
                            $lookup:{
                                from: permisosModel.collection.name,
                                let: {idObjApi:'$arrObjIdApis'},
                                pipeline:[
                                    {$match:{$expr:{$in:['$_id','$$idObjApi']}}},
                                ],
                                as:'apis'
                            }
                        },
                        {$project:{strNombre:1,strDescripcion:1,blnRolDefault:1,blnEstado:1,_idObjRol:1,apis:1}}
                    ],
                    as: 'roles'
                }
            }
            
      
    ])

     if(!obtenerUsuariosAggregate) {
     
        return res.status(400).json({
            ok:false,
            msg: 'El usuario no cuenta con acceso ya que no se encuentra registrado en BD',
            cont:{
                toke: decode.usuario
            }
        })
     }

 
     if(!obtenerUsuariosAggregate.roles) {
     
        return res.status(400).json({
            ok:false,
            msg: 'El usuario no cuenta con un rol asignado correcto, favor verificar',
            cont:{
                usuario: decode.usuario,
            }
        })
     }

     

     if(obtenerUsuariosAggregate.roles.apis) {
         if(obtenerUsuariosAggregate.roles.apis.length <1) {
            return res.status(400).json({
                ok:false,
                msg: 'El usuario no cuenta con apis asignada, favor verificar',
                cont:{
                    usuario: obtenerUsuariosAggregate,
                }
            })

         }else{
            return res.status(400).json({
                ok:false,
                msg: 'El usuario no cuenta con campo api, favor verificar',
                cont:{
                    usuario: obtenerUsuariosAggregate,
                }
            })
         }
        
     }

     console.log(obtenerUsuariosAggregate)
     const encontroRuta = obtenerUsuariosAggregate.roles[0].apis.find(api=>'/api' + api.strRuta === originalUrl && api.strMetodo === originalMetodo);
    if(!encontroRuta){
        return res.status(400).json({
            ok:false,
            msg: `El usuario no cuenta con acceso a la ruta ${originalUrl} en el metodo ${originalMetodo}`,
            cont:{
                usuario: obtenerUsuariosAggregate,
            }
        })
    }
     next();
 })

     
 } catch (error) {

    return res.status(500).json({
        ok:false,
        msg: 'Error del servidor',
        cont:{
           error
        }
    })
     
 }
}

module.exports = {verificarAcceso}