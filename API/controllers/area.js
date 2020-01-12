const database = require('../services/database.js');
const express = require('express');
const router = express.Router();

//route to get all municipalities
router.get('/municipios', async (req, res) => {
    const result = await database.simpleExecute('SELECT * FROM EXOADM.MUNICIPIOS');
    return res.json({
    data: result.rows
    })
});

//route to get all cities
router.get('/ciudades', async (req, res) => {
    const result = await database.simpleExecute('SELECT * FROM EXOADM.CIUDADES');
    return res.json({
    data: result.rows
    })
});
    
//route to get all countries
router.get('/paises', async (req, res) => {
    const result = await database.simpleExecute('SELECT * FROM EXOADM.PAISES');
    return res.json({
    data: result.rows
    })
});
    
//route to get all provinces
router.get('/provincias', async (req, res) => {
    const result = await database.simpleExecute('SELECT * FROM EXOADM.PROVINCIAS');
    return res.json({
    data: result.rows
    })
});

module.exports = router;