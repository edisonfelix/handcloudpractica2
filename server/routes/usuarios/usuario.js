const express = require('express');
const { isAbsolute } = require('path');
const app = express.Router();

let arrJsnUsuarios = []
const path = require('path');
const empresaModel = require('../../models/empresa/empresa.model')
const permisosModel = require('../../models/permisos/api.model')
const RolModel = require('../../models/permisos/rol.model')

//const rutaDescarga = path.resolve(__dirname,'../../assets/index.html')

const {verificarAcceso} = require('../../middlewares/permisos')

const usuarioModel = require('../../models/usuario/usuario.model');

const bcrypt = require('bcrypt');
const { log } = require('console');
const { modelName, db } = require('../../models/producto/producto.model');
const cargarArchivo = require('../../library/cargarArchivos')

//app.get('/',verificarAcceso,async (req,res) => {
app.get('/',verificarAcceso,async (req,res) => {

    try {
        
    

    const blnEstado = req.query.blnEstado == "false" ? false : true


    
    //const obtenerUsuario = await usuarioModel.find({blnEstado:blnEstado},{strContrasena:0});

    const obtenerUsuariosAggregate = await usuarioModel.aggregate([
        {
            $match:{blnEstado:blnEstado}
        },
       
        {
            $lookup:{
            from: empresaModel.collection.name,   //Nombre de la colección de mogodb
            localField: '_idEmpresa',
            foreignField: '_id',
            as: 'Empresa'
            },
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
                        {$project:{strNombre:1,strDescripcion:1,blnRolDefault:1,blnEstado:1,apis:1}}
                    ],
                    as: 'roles'
                }
            },
            {
                $project:{
                    strNombre:1,
                    strApellido:1,
                    strEmail:1,
                    strDireccion:'$strDireccion',
                    Empresa:{
                        $arrayElemAt:['$Empresa',0]
                    },
                    roles:{
                        $arrayElemAt:['$roles',0]
                    },
                }
            }
            
      
    ])
   
    if(obtenerUsuariosAggregate.length == 0){

        return res.status(400).json({
            ok: false,
            msg: 'No se encontro usuario',
            cont:{obtenerUsuariosAggregate}
        })

    }

   

    return res.status(200).json({
        ok: true,
        msg: 'Se encontro los usuarios',
        count: obtenerUsuariosAggregate.length,
        cont:{obtenerUsuariosAggregate}
    })

} catch (error) {
    const err = Error(error);

    return res.status(500).json({
        ok: false,
        msg: 'Error en el servidor',
        cont:{err: err.message ? err.message : err.name ? err.name : err}
    }) 
}
})

//app.post('/',verificarAcceso, async (req,res) => {
app.post('/', async (req,res) => {

    try {
        
     //bcrypt.hashSync(req.body.strContrasena,10)
   const body = {...req.body,strContrasena: req.body.strContrasena ? bcrypt.hashSync(req.body.strContrasena,10) : undefined};
    console.log(body);

    const encontroEmail = await usuarioModel.find({strEmail:body.strEmail});
    const encontroNombreUsuario = await usuarioModel.find({strNombreUsuario:body.strNombreUsuario});

    if(encontroEmail.length > 0){
        return res.status(400).json({
            ok: false,
            msg: 'El email ya se encuentra registrado',
            cont:{body}
        })
    }

    if(encontroNombreUsuario.length > 0){
        return res.status(400).json({
            ok: false,
            msg: 'El nombre de usuario ya se encuentra registrado',
            cont:{body}
        })
    }



    const UsuarioBody = new usuarioModel(body);
    const err = UsuarioBody.validateSync();



    if(err){
        return res.status(400).json({
            ok: false,
            msg: 'No se estan ingresando los datos del usuario nuevo',
            cont:{err}
        })
    }

    if(req.files){
        
        if(!req.files.strImagen){
            return res.status(400).json({
                ok: false,
                msg: 'No se recibio archivo strImagen, favor ingrese',
                cont:{}
            })
        }

        console.log(req.files,'tiene archivos');
        UsuarioBody.strImagen = await cargarArchivo.subirArchivo(req.files.strImagen,'usuario',['image/png', 'image/jpeg']);
        
    }

    if(!req.body._idObjRol){
        const encontroRolDefault = await RolModel.findOne({blnRolDefault:true})
        UsuarioBody._idObjRol = encontroRolDefault._id;
    }

    const UsuarioRegistrado = await UsuarioBody.save();

    return res.status(200).json({
        ok: true,
        msg: 'Usuario registrado con exito',
        cont:{UsuarioRegistrado}
    })

    } catch (error) {
        const err = Error(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor',
            cont:{err: err.message ? err.message : err.name ? err.name : err}
        }) 
    }
})

app.put('/',verificarAcceso,async (req,res) => {

    try {

        const _idUsuario = req.query._idUsuario;
        
        if(!_idUsuario || _idUsuario.length != 24)
        {
            return res.status(400).json({
                ok:false,
                msg: _idUsuario ? 'No es un id valido' : 'No se recibio el identificador del usuario',
                cont:{
                    _idUsuario
                }
            })
        }

        const encontrarUsuario = await usuarioModel.findOne({_id:_idUsuario,blnEstado:true})

        if(!encontrarUsuario){
            return res.status(400).json({
                ok:false,
                msg: 'No se encontro el usuario seleccionado',
                cont:{
                    _idUsuario
                }
            })
        }

        const buscaUsuario = await usuarioModel.findOne({strNombreUsuario: req.body.strNombreUsuario, _id:{$ne: _idUsuario}},{strNombreUsuario:1,strNombre:1,_idEmpresa:1})

        if (buscaUsuario){
            return res.status(400).json({
                ok:false,
                msg: 'El nombre de usuario ya se encuentra registrado en la BD',
                cont:{
                    buscaUsuario
                }
            })
        }

        const actualizarUsuario = await  usuarioModel.findByIdAndUpdate(_idUsuario,
            {$set:{
                strNombre:req.body.strNombre,
                strApellido:req.body.strApellido,
                strDireccion:req.body.strDireccion,
                strNombreUsuario:req.body.strNombreUsuario,
                _idEmpresa:req.body._idEmpresa}},{new: true})

       

        if(!actualizarUsuario){
            return res.status(400).json({
                ok:false,
                msg: 'No se logro actualizar el usuario',
                cont:{
                    _idUsuario
                }
            })
        }

        console.log(actualizarUsuario)
        console.log(encontrarUsuario)
       
        return res.status(200).json({
            ok:true,
            msg: 'El usuario se actualizo con éxito',
            cont:{
                 UsuarioAnt: encontrarUsuario,
                 UsuarioNuevo: actualizarUsuario
            }
        })
        
        
    } catch (error) {
        //console.log(error)
       return res.status(500).json({
           ok:false,
           msg: 'Error del servidor',
           cont:{
               error
           }
       })
    }
})

app.delete('/',verificarAcceso,async (req,res) => {

    const _idUsuario = req.query._idUsuario
    const blnEstado = req.query.blnEstado == "false" ? false : true

    if(!_idUsuario || _idUsuario.length != 24){
        return res.status(400).json({
            ok:false,
            msg: _idUsuario ? 'No es un id valido' : 'No se ingreso un idUsuario',
            cont:{
                _idUsuario: _idUsuario
            }
        })
    }

    const modificarEstadoUsuario = await usuarioModel.findOneAndUpdate({_id:_idUsuario},{set:{blnEstado:blnEstado}},{new: true})

    return res.status(200).json({
        ok:true,
        msg: blnEstado == true ? 'Se activo el usuario de manera existosa' : 'Se desactivo el usuario',
        cont:{
            modificarEstadoUsuario
        }
    })

   
})



module.exports = app;