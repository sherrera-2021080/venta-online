const { response, request } = require('express');
//Importación del modelo


const Factura = require('../models/factura');
const Usuario = require('../models/usuario');

const getFacturas = async (req = request, res = response) => {

    //condiciones del get
    const id = req.usuario;
    const query = { usuario:id };

    const listaFactura = await Promise.all([
        Factura.countDocuments(query),
        Factura.find(query).populate('usuario','nombre')
    ]);

    res.json({
        msg: 'get Api - Controlador factura',
        listaFactura
    });
}

const postFactura = async (req = request, res = response) => {
    const { estado, usuario, ...body } = req.body;

    //Generar la data
    const data = {
        ...body,
        usuario: req.usuario._id,
    }

    const factura = await Factura(data);

    //Guardar en la DB
    await factura.save();
    res.status(201).json(factura);
}

const putFactura = async (req = request, res = response) => {

    //Req.params sirve para traer parametros de las rutas
    const { id } = req.params;
    const { _id, usuario, ...resto } = req.body;

    //Editar al Curso por el id
    const facturaEditada = await Factura.findByIdAndUpdate(id, resto);

    res.status(201).json(facturaEditada);
}

const deleteFactura = async(req = request, res = response) => {
    //Req.params sirve para traer parametros de las rutas
    const { id } = req.params;

    //Eliminar fisicamente de la DB
    const facturaEliminada = await Factura.findByIdAndDelete( id );

    res.status(201).json(facturaEliminada);
}

module.exports = {
    getFacturas,
    postFactura,
    putFactura,
    deleteFactura,
}

// CONTROLADOR