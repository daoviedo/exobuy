const database = require('../services/database.js');
const checkAdmin = require('../middleware/checkAdmin');
const express = require('express');
const router = express.Router();

//route to get all municipalities
router.get('/municipios', async (req, res) => {
    const result = await database.simpleExecute('SELECT * FROM EXOADM.MUNICIPIOS');
    res.json({
        data: result.rows
    })
});

router.post('/municipios', checkAdmin, async (req, res) => {
    const municipio = req.body.municipio;
    const cod_provincia = req.body.cod_provincia;
    const cod_pais = req.body.cod_pais;
    const result = await database.simpleExecute(`INSERT INTO EXOADM.MUNICIPIOS (MUNICIPIOS.MUNICIPIO, MUNICIPIOS.COD_PROVINCIA, MUNICIPIOS.COD_PAIS) VALUES('${municipio}', ${cod_provincia}, '${cod_pais}')`);
    res.status(200).json({
        statusCode: 1,
        result: result
    })
});

//route to get all cities
router.get('/ciudades', async (req, res) => {
    const result = await database.simpleExecute('SELECT * FROM EXOADM.CIUDADES');
    res.json({
        data: result.rows
    })
});

router.post('/ciudades', checkAdmin, async (req, res) => {
    const ciudad = req.body.ciudad;
    const cod_municipio = req.body.cod_municipio;
    const cod_provincia = req.body.cod_provincia;
    const cod_pais = req.body.cod_pais;
    const result = await database.simpleExecute(`INSERT INTO EXOADM.CIUDADES (CIUDADES.CIUDAD, CIUDADES.COD_MUNICIPIO, CIUDADES.COD_PROVINCIA, CIUDADES.COD_PAIS) VALUES('${ciudad}', ${cod_municipio}, ${cod_provincia}, '${cod_pais}')`);
    res.status(200).json({
        statusCode: 1,
        result: result
    })
});
    
//route to get all countries
router.get('/paises', async (req, res) => {
    const result = await database.simpleExecute('SELECT * FROM EXOADM.PAISES');
    res.json({
        data: result.rows
    })
});
    
//route to get all provinces
router.get('/provincias', async (req, res) => {
    const result = await database.simpleExecute('SELECT * FROM EXOADM.PROVINCIAS');
    res.json({
        data: result.rows
    })
});

router.post('/provincias', checkAdmin, async (req, res) => {
    const provincia = req.body.provincia;
    const cod_pais = req.body.cod_pais;
    const result = await database.simpleExecute(`INSERT INTO EXOADM.PROVINCIAS (PROVINCIAS.PROVINCIA, PROVINCIAS.COD_PAIS) VALUES('${provincia}', '${cod_pais}')`);
    res.status(200).json({
        statusCode: 1,
        result: result
    })
});

module.exports = router;