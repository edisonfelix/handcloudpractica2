const express = require('express');
const { status } = require('express/lib/response');
const res = require('express/lib/response');
const app = express.Router();
const arrJsnProductos = [];

app.get('/',(req,res) =>{
    const arrProductos = arrJsnProductos;
    
    if(arrProductos == 0){
        return res.status(400).json({
            ok: false,
            msg: "No existen datos de productos",
            cont:{
                arrProductos
            }
        })
    }

})

module.exports = app;