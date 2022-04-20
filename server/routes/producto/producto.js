const express = require('express');
const { status } = require('express/lib/response');
const res = require('express/lib/response');
const app = express.Router();
let arrJsnProductos = [];//{_id:1,strNombre:"",strDescripcion:"",nmbCantidad:0,nmbPrecio:0}];

app.get('/',(req,res) =>{
    const arrProductos = arrJsnProductos;
    
    if(arrProductos.length == 0){
        return res.status(400).json({
            ok: false,
            msg: "No existen datos de productos",
            cont:{
                arrProductos
            }
        })
    }else{
        return res.status(200).json({
            ok: true,
            msg: "Se muestran los datos de la BD",
            cont:{
                arrProductos
            }
        })
    }

})

app.post('/',(req,res) => {
    const body = {
        _id : parseInt(req.body._id),
        strNombre: req.body.strNombre,
        strDescripcion: req.body.strDescripcion,
        nmbCantidad: parseInt(req.body.nmbCantidad),
        nmbPrecio: parseInt(req.body.nmbPrecio)
    }

    if(!req.body._id || !req.body.strNombre || !req.body.strDescripcion || !req.body.nmbCantidad || !req.body.nmbPrecio){
        return res.status(400).json({
            ok:false,
            msg:`No se han recibido todos los datos`,
            cont:{
                body
            }
        })
    }else{
        const encuentraProducto = arrJsnProductos.find(producto => producto._id == body._id)
        
        if(encuentraProducto){
           return res.status(400).json({
               ok:false,
               msg: `Ya existe un producto con el mismo _id: ${body._id}`,
               cont:{
                   arrJsnProductos
               }
           }) 
        }else{

            arrJsnProductos.push(body);

            return res.status(200).json({
                ok:true,
                msg:"El producto se añadio con éxito",
                cont:{
                    arrJsnProductos
                }
            })

        }
        
    }


})

app.put('/',(req,res) => {
    const _idProducto = parseInt(req.body._id);

    if(!_idProducto){
        return res.status(400).json({
            ok:false,
            msg: "No se ha enviado ningun _id de producto"
        })
    }else{
        const encuentraProducto = arrJsnProductos.find(producto => producto._id == _idProducto);

        if(!encuentraProducto){
            return res.status(400).json({
                ok:false,
                msg: `No se encontro ningun producto con el _id: ${_idProducto}`,
                cont:{
                    arrJsnProductos
                }
            })
        }else{

            const actualizaProducto = {_id:_idProducto, strNombre:req.body.strNombre,strDescripcion:req.body.strDescripcion,
            nmbCantidad:parseInt(req.body.nmbCantidad),nmbPrecio:parseInt(req.body.nmbPrecio)};

            //console.log(actualizaProducto);

            const filtraProducto = arrJsnProductos.filter(producto => producto._id != _idProducto);

            console.log(filtraProducto);

            arrJsnProductos = filtraProducto;
            arrJsnProductos.push(actualizaProducto);

            return res.status(200).json({
                ok:false,
                msg: `Se actualizo el producto con  _id: ${_idProducto}`,
                cont:{
                    arrJsnProductos
                }
            })   


        }

    }

})

app.delete('/',(req,res) => {

    const _idProducto = parseInt(req.body._id);

    if(!_idProducto){
        return res.status(400).json({
            ok:false,
            msg: "No se ha enviado ningun _id de producto"
        })
    }else{
        const encuentraProducto = arrJsnProductos.find(producto => producto._id == _idProducto);

        if(!encuentraProducto){
            return res.status(400).json({
                ok:false,
                msg: `No se encontro ningun producto con el _id: ${_idProducto}`,
                cont:{
                    arrJsnProductos
                }
            })
        }else{

            const actualizaProducto = {_id:_idProducto, strNombre:req.body.strNombre,strDescripcion:req.body.strDescripcion,
            nmbCantidad:req.body.nmbCantidad,nmbPrecio:req.body.nmbPrecio};

            const filtraProducto = arrJsnProductos.filter(producto => producto._id != _idProducto);

            arrJsnProductos = filtraProducto;
           
            return res.status(200).json({
                ok:false,
                msg: `Se elimino el producto con  _id: ${_idProducto}`,
                cont:{
                    arrJsnProductos
                }
            })   


        }

    }

})

module.exports = app;