const express = require('express');
const { status } = require('express/lib/response');
const res = require('express/lib/response');
const app = express.Router();

const empresaModel = require('../../models/empresa/empresa.model');

app.get('/', async (req,res) => {

    const blnEstado = req.query.blnEstado == "false" ? false : true
    const obtenerEmpresas = await empresaModel.find({blnEstado:blnEstado});
    
    //funcion con aggregate
   /* const obtenerEmpresasAggrgate = await empresaModel.aggregate([
           {$match:{$expr:{$eq:"blnEstado",blnEstado}}}
    
    ]);*/
    
    
    //funcion con aggregate
    
       
    
        return res.status(200).json({
            ok: true,
            msg: "Accedi a la ruta productos",
            count: obtenerEmpresas.length,
            cont:{
                obtenerEmpresas
            }
        })
    })


    app.post('/', async (req,res) => {
        const body = req.body;
        const EmpresaBody = new empresaModel(body);
        const err = EmpresaBody.validateSync();
    
    
    
        if(err){
            return res.status(400).json({
                ok: false,
                msg: 'No se estan ingresando los datos de la empresa',
                cont:{err}
            })
        }
    
        const EmpresaRegistrada = await EmpresaBody.save();
    
        return res.status(200).json({
            ok: true,
            msg: 'Empresa registrado con exito',
            cont:{EmpresaRegistrada}
        })
    })
    
    
    app.put('/',async (req,res) =>{

        try {
    
            const _idEmpresa = req.query._idEmpresa;
            console.log(_idEmpresa)
            if(!_idEmpresa || _idEmpresa.length != 24 ){
                return res.status(400).json({
                    ok:false,
                    msg: _idEmpresa ? 'El identificador no es valido' : 'No se recibio el identificador del producto',
                    cont:{
                        _idEmpresa
                    }
                })
            }
    
            const encontrarEmpresa = await empresaModel.findOne({_id:_idEmpresa,blnEstado:true});
        
            if(!encontrarEmpresa){
                return res.status(200).json({
                    ok:false,
                    msg: 'El producto no se encuentra registrado',
                    cont:{
                        _idEmpresa
                    }
                })
            }
    
            const buscaEmpresa = await empresaModel.findOne({strNombre: req.body.strNombre, blnEstado : true, _id:{$ne: _idEmpresa}},{strNombre:1})
    
            if (buscaEmpresa){
                return res.status(400).json({
                    ok:false,
                    msg: 'El nombre de la empresa ya se encuentra registrado en la BD',
                    cont:{
                        buscaEmpresa
                    }
                })
            }
    
            //const actualizarEmpresa = await EmpresaModel.updateOne({_id:_idEmpresa},{$set:{...req.body}})
            const actualizarEmpresa = await empresaModel.findByIdAndUpdate(_idEmpresa,{$set:{...req.body}},{new: true})
            
            console.log(actualizarEmpresa);
            if (!actualizarEmpresa)
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
                    empresaAnterior: encontrarEmpresa,
                    empresaNuevo: actualizarEmpresa
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
        
            const _idEmpresa = req.query._idEmpresa
            const blnEstado = req.query.blnEstado == "false" ? false : true
        
            console.log(blnEstado)
        
            if(!_idEmpresa || _idEmpresa.length != 24){
                return res.status(400).json({
                    ok:false,
                    msg: _idEmpresa ? 'El identificador no es valido' : 'No se recibio el identificador del producto',
                    cont:{
                        _idEmpresa
                    }
                })
            }
        
            const encontrarEmpresa = await empresaModel.findOne({_id:_idEmpresa})
        
            if(!encontrarEmpresa){
                return res.status(400).json({
                    ok:false,
                    msg: 'El identificador no se encuentra en la BD',
                    cont:{
                        _idEmpresa:_idEmpresa
                    }
                })
            }
        
            //const eliminarProducto = await empresaModel.findByIdAndDelete({_id:_idEmpresa})
            const desactivarEmpresa = await empresaModel.findOneAndUpdate({_id:_idEmpresa},{$set:{blnEstado:blnEstado}},{new: true})
        
            if(!desactivarEmpresa){
                return res.status(400).json({
                    ok:false,
                    msg: 'La empresa no se logro desactivar de la BD',
                    cont:{
                        _idEmpresa:_idEmpresa
                    }
                })
            }
        
            
        
            return res.status(200).json({
                ok:true,
                msg: blnEstado == true ? 'Se activo la empresa de manera existosa' : 'Se desactivo el usuario',
                cont:{
        
                    desactivarEmpresa
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


module.exports = app;



