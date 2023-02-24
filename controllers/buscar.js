const { request, response } = require('express');
const { ObjectId } = require('mongoose').Types;



const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria')

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles',
];

const buscarUsuarios = async( termino = '', res = response) => {

    const esMongoID = ObjectId.isValid( termino );  //TRUE

    if ( esMongoID ) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            //results: [ usuario ]
            results: ( usuario ) ? [ usuario ] : [] 
            //Preguntar si el usuario existe, si no existe regresa un array vacio
        });
    } 

    //Expresiones regulares, buscar sin impotar mayusculas y minusculas (DIFIERE DE EL)
    const regex = new RegExp( termino, 'i');

    const usuarios = await Usuario.find({
        $or: [ { nombre: regex }, { correo: regex } ],
        $and: [ { estado: true } ]
    });

    res.json({
        results: usuarios
    })
}

const buscarCategorias = async( termino = '', res = response) => {

    const esMongoID = ObjectId.isValid( termino );  //TRUE

    if ( esMongoID ) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            //results: [ usuario ]
            results: ( categoria ) ? [ categoria ] : [] 
            //Preugntar si el usuario existe, si no existe regresa un array vacio
        });
    } 

    //Expresiones regulares, buscar sin impotar mayusculas y minusculas (DIFIERE DE EL)
    const regex = new RegExp( termino, 'i');

    const categoria = await Categoria.find({
        $or: [ { nombre: regex }],
        $and: [ { estado: true } ]
    });

    res.json({
        results: categoria
    })
}

const buscar = (req = request, res = response) => {

    const { coleccion, termino } = req.params;

    if ( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg: `La colección: ${ coleccion } no existe en la DB
                  Las colecciones permitidas son: ${ coleccionesPermitidas }`
        });
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;
        case 'categorias':
            buscarCategorias(termino, res);
           
        break;
        case 'productos':
            
        break;
        default:
            res.status(500).json({
                msg: 'Ups, se me olvido hacer esta busqueda...'
            });
        break;
    }
}

module.exports = {
    buscar
}