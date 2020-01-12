const database = require('../services/database.js');
const express = require('express');
const router = express.Router();

//route to get all municipalities
router.post('/login', async (req, res) => {
    const result = await database.simpleExecute('SELECT * FROM EXOADM.MUNICIPIOS');
    return res.json({
    data: result.rows
    })
});

module.exports = router;