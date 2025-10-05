const db = require("../models");
const Bicycle = db.bicycles;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {

    if (!req.body.brand) {
        res.status(400).send({
            message: "El contenido no puede estar vacío!"
        });
        return;
    }

    
    const bicycle = {
        brand: req.body.brand,
        model: req.body.model
    };
    
    Bicycle.create(bicycle)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Error al crear la bicicleta."
        });
    });

};


exports.findAll = (req, res) => {

    Bicycle.findAll()
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Error al recuperar las bicicletas."
        });
    });
};


exports.findOne = (req, res) => {};
exports.update = (req, res) => {};
exports.delete = (req, res) => {};
exports.deleteAll = (req, res) => {};
