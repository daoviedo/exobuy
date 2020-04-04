const database = require('../services/database.js');
const checkAdmin = require('../middleware/checkAdmin');
const express = require('express');
const router = express.Router();

router.post('/vendor', checkAdmin, async (req, res) => {
    const cod_usuario = req.body.cod_usuario;
    const cod_membresia = req.body.cod_membresia;

    const result = await database.simpleExecute(`INSERT INTO EXOADM.MIEMBROS (MIEMBROS.COD_USUARIO, MIEMBROS.FECHA_SUSC_MIEMBRO, MIEMBROS.COD_MEMBRESIA, MIEMBROS.COD_ESTATUS_MEMBRESIA) VALUES(${cod_usuario}, CURRENT_DATE, ${cod_membresia}, 1)`);
    res.status(200).json({
        statusCode: 1,
        result: result
    })
});

module.exports = router;