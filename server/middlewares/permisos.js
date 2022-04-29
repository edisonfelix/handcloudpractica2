const { decode } = require('jsonwebtoken')
const jwt = require('jsonwebtoken')
require('../config/config')
require('colors')

const verificarAcceso = async (req,res,next) => {
 try {

    const url = req.originalUrl.split('?')
    const originalUrl = url[0]

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

 jwt.verify(token,process.env.SEED, (err,decode) => {
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
     console.log(`Se permitio el acceso a a ruta:`,`${originalUrl}`.green)
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