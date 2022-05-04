const express = require('express');
const app = express.Router();
const UsuarioModel = require('../../models/usuario/usuario.model');
const bcryp = require('bcrypt');
const jwt = require('jsonwebtoken');
require('../../config/config')

app.post('/login',async (req,res) => {
    
    try {
        
        const strEmail = req.body.strEmail;
    const strContrasena = req.body.strContrasena;

    
    if(!strEmail || !strContrasena){
       return res.status(400).json({
           ok:false,
           msg: !strEmail && !srtContrasena ? 'No se recibio un strEmail, strContrasena, favor de ingresar' : 'No se recibio srtEmai, favor ingresarlo',
           cont:{
               strEmail,
               strContrasena
           }
       })
    }

    

    const encontrarEmail = await UsuarioModel.findOne({strEmail:strEmail});


    if(!encontrarEmail){
        return res.status(400).json({
            ok:false,
            msg: 'El correo ó la contraseña son incorrectas favor verfificar',
            cont:{
               strEmail,
               strContrasena
            }
        })
    }

  

    const compararContrasena = bcryp.compareSync(strContrasena, encontrarEmail.strContrasena)

    if(!compararContrasena){
        return res.status(400).json({
            ok:false,
            msg: 'La contraseña son incorrectas favor verfificar',
            cont:{
               strEmail,
               strContrasena
            }
        })
    }

    const token = jwt.sign({usuario:encontrarEmail},process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN})

    return res.status(200).json({
        ok:true,
        msg: 'Se logueo el usuario de manera exitosa',
        cont:{
          usuario:encontrarEmail,
          token
        }
    })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok:false,
            msg: 'Error del servidor',
            cont:{
               error
            }
        })
    }

})

module.exports = app;