const express = require('express');
const { isAbsolute } = require('path');
const app = express.Router();
let arrJsnUsuarios = []
const path = require('path');
const productoModel = require('../../models/producto/producto.model');
const usuarioModel = require('../../models/usuario/usuario.model');
//const rutaDescarga = path.resolve(__dirname,'../../assets/index.html')

const UsuarioModel = require('../../models/usuario/usuario.model');

const bcrypt = require('bcrypt');
const { log } = require('console');


app.get('/',async (req,res) => {
    const obtenerUsuario = await UsuarioModel.find({},{strContrasena:0});

    if(obtenerUsuario.length == 0){

        return res.status(400).json({
            ok: false,
            msg: 'No se encontro usuario',
            cont:{obtenerUsuario}
        })

    }

    return res.status(200).json({
        ok: true,
        msg: 'Se encontro los usuarios',
        count: obtenerUsuario.length,
        cont:{obtenerUsuario}
    })
})


app.post('/', async (req,res) => {

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

    const UsuarioRegistrado = await UsuarioBody.save();

    return res.status(200).json({
        ok: true,
        msg: 'Usuario registrado con exito',
        cont:{UsuarioRegistrado}
    })
})


/*
app.get('/',(req,res) => {
    const arrUsuarios = arrJsnUsuarios;
    if(arrJsnUsuarios.length > 0){

        return res.status(200).json({
            ok: true,
            msg: 'Se recibieron los usuarios de manera exitosa',
            cont:{arrUsuarios}
        })

    }else{

        return res.status(400).json({
            ok: true,
            msg: 'No se encontraron usuarios',
            cont:{arrUsuarios}
        })

    }

  

    //return res.status(200).download(rutaDescarga,'documento.html')
   
})

app.get('/obtenerUsuario',(req,res) =>{

    const _idUsuario = parseInt(req.query._idUsuario);

    if(!_idUsuario){
        return res.status(400).json({
            ok:false,
            msg: `No envio ningun datos de usuario id: ${_idUsuario}`
        })
    }else{
        const encontrarUsuario = arrJsnUsuarios.find(usuario => usuario._id == _idUsuario);
        if(encontrarUsuario){
            return res.status(200).json({
                ok:true,
                msg: "Se encontro el usuario",
                cont:{
                    encontrarUsuario
                }
            })
        }else{
            return res.status(400).json({
                ok:false,
                msg: `No se encontro ningun datos de usuario id: ${_idUsuario}`
            })
        }
    }

})

app.post('/',(req,res) => {
    const body ={
        strNombre: req.body.strNombre,
        strApellido: req.body.strApellido,
        strEmail: req.body.strEmail,
        _id: parseInt(req.body._id)
    }

    if(body.strNombre && body.strApellido && body.strEmail && body._id){

        const encontroUsuario = arrJsnUsuarios.find(usuario => usuario._id == body._id)

        if(encontroUsuario){

            res.status(200).json({
                ok: false,
                msg: 'Ya existe un usuario con el mismo id',
                cont:{encontroUsuario}
            })

        }else{

            arrJsnUsuarios.push(body)

            res.status(400).json({
                ok:true,
                msg: 'Se registro el usuario correctamente',
                cont: {arrJsnUsuarios}
            })

        }
       
    }else{
        res.status(400).json({
            ok: false,
            msg: 'No se enviaron datos correctos',
            cont:{body}
        })
    }

    

   

    
    
})

app.put('/',(req,res) => {
    const _idUsuario = parseInt(req.query._idUsuario);

     console.log(typeof _idUsuario)
    if(_idUsuario){
        const encontroUsuario = arrJsnUsuarios.find(usuario => usuario._id === _idUsuario);
        if(encontroUsuario){
            const actuaizaUsuario = {_id: _idUsuario, strNombre: req.body.strNombre, strApellido: req.body.strApellido, strEmail: req.body.strEmail};
            const filtraUsuario = arrJsnUsuarios.filter(usuario => usuario._id != _idUsuario)
            arrJsnUsuarios = filtraUsuario;
            arrJsnUsuarios.push(actuaizaUsuario);

            return res.status(200).json({
                ok: true,
                msg: 'El usuario se actualizo de manera exitosa',
                cont:{
                   actuaizaUsuario
                }
            })

        }else{

            return res.status(400).json({
                ok: false,
                msg: `El usuario con el _id: ${_idUsuario} , no se ecuentra rgistrado en la BD`,
                cont:{
                    _idUsuario
                }
            })
        }

    }else{
        return res.status(400).json({
            ok: false,
            msg: 'El identificador del usuario no existe',
            cont:{
                _idUsuario
            }
        })
    }

})

app.delete('/',(req,res) => {
    const _idUsuario = parseInt(req.body._id)

    if (_idUsuario){

        const findUsuario = arrJsnUsuarios.find(usuario => usuario._id == _idUsuario)
        
        if (findUsuario) {

            const filtraUsuario = arrJsnUsuarios.filter(usuario => usuario._id != _idUsuario)

            arrJsnUsuarios = filtraUsuario

            return res.status(200).json({
                ok: true,
                msg: 'El usuario fue eliminado',
                cont:{
                    arrJsnUsuarios
                }
            })


        }else{

            return res.status(400).json({
                ok: false,
                msg: `No se encontro un usuario con el id: ${_idUsuario} en la BD`,
                cont:{
                    _idUsuario
                }
            })

        }
    }else{
        return res.status(400).json({
            ok: false,
            msg: 'No se recibio un id d usuario',
            cont:{
                _idUsuario
            }
        })
    }

})

*/

module.exports = app;