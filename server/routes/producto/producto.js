const express = require('express');
const { status } = require('express/lib/response');
const res = require('express/lib/response');
const productoModel = require('../../models/producto/producto.model');
const app = express.Router();
//let arrJsnProductos = [];//{_id:1,strNombre:"",strDescripcion:"",nmbCantidad:0,nmbPrecio:0}];

const ProductoModel = require('../../models/producto/producto.model')

app.get('/', async (req,res) => {
const obtenerProductos = await ProductoModel.find();

    console.log(obtenerProductos);

    return res.status(200).json({
        ok: true,
        msg: "Accedi a la ruta productos",
        cont:{
            obtenerProductos
        }
    })
})

app.post('/', async (req,res) => {
    const body = req.body;
    const ProductoBody = new productoModel(body);
    const err = ProductoBody.validateSync();



    if(err){
        return res.status(400).json({
            ok: false,
            msg: 'No se estan ingresando los datos del producto',
            cont:{err}
        })
    }

    const ProductoRegistrado = await ProductoBody.save();

    return res.status(200).json({
        ok: true,
        msg: 'Producto registrado con exito',
        cont:{ProductoRegistrado}
    })
})

app.put('/',async (req,res) =>{

    try {

        const _idProducto = req.query._idProducto;
        console.log(_idProducto)
        if(!_idProducto || _idProducto.length != 24 ){
            return res.status(400).json({
                ok:false,
                msg: _idProducto ? 'El identificador no es valido' : 'No se recibio el identificador del producto',
                cont:{
                    _idProducto
                }
            })
        }

        const encontrarProducto = await ProductoModel.findOne({_id:_idProducto});
    
        if(!encontrarProducto){
            return res.status(200).json({
                ok:false,
                msg: 'El producto no se encuentra registrado',
                cont:{
                    _idProducto
                }
            })
        }

        //const actualizarProducto = await ProductoModel.updateOne({_id:_idProducto},{$set:{...req.body}})
        const actualizarProducto = await ProductoModel.findByIdAndUpdate(_idProducto,{$set:{...req.body}},{new: true})
        
        console.log(actualizarProducto);
        if (!actualizarProducto)
        {
            return res.status(400).json({
            ok:false,
            msg: 'Producto no se logro actualizar',
            cont:{
                    ...req.body
                }
            })
        }

        return res.status(200).json({
            ok:true,
            msg: 'Producto se actualizó',
            cont:{
                productoAnterior: encontrarProducto,
                ProductoNuevo: actualizarProducto
                }
        })

    } catch (error) {

        return res.status(500).json({
            ok:false,
            msg: 'Error de servidor',
            cont:{
                error
            }
        })
        
    }

   
    

})


/*app.get('/',(req,res) =>{
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

})*/

module.exports = app;