const express = require('express');
const database = require('../services/database.js');
const checkAuth = require('../middleware/checkAuth');
const router = express.Router();

//Verify Token
router.get('/token', checkAuth, async (req, res) => {
    const userID = req.user.ID;
    const response = await database.simpleExecute(`SELECT USUARIOS.COD_TIPO_USUARIO FROM EXOADM.USUARIOS WHERE USUARIOS.COD_USUARIO=${userID}`);

    res.status(200).json({
        authentication: true,
        access: response.rows[0].COD_TIPO_USUARIO
    })
});

//Check If Email has been activated
router.get('/email', checkAuth, async (req, res) => {
    const userID = req.user.ID;
    const response = await database.simpleExecute(`SELECT USERS.ACTIVE FROM OAUTH.USERS WHERE USERS.ID=${userID}`);
    res.status(200).json({
        active: response.rows[0].ACTIVE
    })
});

module.exports = router;