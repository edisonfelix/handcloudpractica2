const express = require('express')
const fileUpload = require('express-fileupload')
const app = express();
const uniqid = require('uniqid');
const fs = require('fs');
const path = require('path');
const { log } = require('console');

app.use(fileUpload);

const subirArchivo = async (file,route,exts) =>{
    try {
        if(!file){
            throw new Error('No se recibio un archivo valido')
        }
        if(!exts.includes(file.mimetype)){
            throw new Error(`Solo las extensiones (${exts.join(',')}) son aceptadas`)
        }
        let nameImg = uniqid() + path.extname(file.name);

        await file.mv(path.resolve(__dirname,`../../upload/${route}/${nameImg}`)).catch(error => {
            console.log(error);
            throw new Error('Error al tratar de subir un archivo al servidor')
        })

        return nameImg;

    } catch (error) {
       return error
    }
    
}


module.exports = {subirArchivo};
