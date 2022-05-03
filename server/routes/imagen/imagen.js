const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express.Router();

app.get('/:ruta/:nameImg',(req, res) => {
    const ruta = req.params.ruta;
    const nameImg = req.params.nameImg;
    const rutaImagen = path.resolve(__dirname,`../../../upload/${ruta}/${nameImg}`)
    const noImagen = path.resolve(__dirname,'../../assets/noimagen.jpg')

    if(fs.existsSync(rutaImagen)){
        return res.sendFile(rutaImagen)
    }else{
        return res.sendFile(noImagen)
    }

})


module.exports = app;
