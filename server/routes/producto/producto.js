const express = require('express');
const { status } = require('express/lib/response');
const res = require('express/lib/response');
const productoModel = require('../../models/producto/producto.model');
const app = express.Router();
//let arrJsnProductos = [];//{_id:1,strNombre:"",strDescripcion:"",nmbCantidad:0,nmbPrecio:0}];

const ProductoModel = require('../../models/producto/producto.model')

app.get('/', async (req,res) => {

const blnEstado = req.query.blnEstado == "false" ? false : true
const obtenerProductos = await ProductoModel.find({blnEstado:blnEstado});

//funcion con aggregate
const obtenerProductosAggrgate = await productoModel.aggregate([
       {$match:{$expr:{$eq:"blnEstado",blnEstado}}}

]);


//funcion con aggregate

    console.log(obtenerProductos);

    return res.status(200).json({
        ok: true,
        msg: "Accedi a la ruta productos",
        count: obtenerProductos.length,
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

        const encontrarProducto = await ProductoModel.findOne({_id:_idProducto,blnEstado:true});
    
        if(!encontrarProducto){
            return res.status(200).json({
                ok:false,
                msg: 'El producto no se encuentra registrado',
                cont:{
                    _idProducto
                }
            })
        }

        const buscaProducto = await productoModel.findOne({strNombre: req.body.strNombre, blnEstado : true, _id:{$ne: _idProducto}},{strNombre:1})

        if (buscaProducto){
            return res.status(400).json({
                ok:false,
                msg: 'El nombre del producto ya se encuentra registrado en la BD',
                cont:{
                    buscaProducto
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

app.delete('/',async (req,res) => {

try {

    const _idProducto = req.query._idProducto
    const blnEstado = req.query.blnEstado == "false" ? false : true

    console.log(blnEstado)

    if(!_idProducto || _idProducto.length != 24){
        return res.status(400).json({
            ok:false,
            msg: _idProducto ? 'El identificador no es valido' : 'No se recibio el identificador del producto',
            cont:{
                _idProducto
            }
        })
    }

    const encontrarProducto = await ProductoModel.findOne({_id:_idProducto})

    if(!encontrarProducto){
        return res.status(400).json({
            ok:false,
            msg: 'El identificador no se encuentra en la BD',
            cont:{
                _idProducto:_idProducto
            }
        })
    }

    //const eliminarProducto = await ProductoModel.findByIdAndDelete({_id:_idProducto})
    const desactivarProducto = await ProductoModel.findOneAndUpdate({_id:_idProducto},{$set:{blnEstado:blnEstado}},{new: true})

    if(!desactivarProducto){
        return res.status(400).json({
            ok:false,
            msg: 'El producto no se logro desactivar de la BD',
            cont:{
                _idProducto:_idProducto
            }
        })
    }

    

    return res.status(200).json({
        ok:true,
        msg: blnEstado == true ? 'Se activo el usuario de manera existosa' : 'Se desactivo el usuario',
        cont:{

            desactivarProducto
        }
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