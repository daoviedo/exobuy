const express = require('express');
const database = require('../services/database.js');
const checkAuth = require('../middleware/checkAuth');
const router = express.Router();

//Verify Token
router.get('/token', checkAuth, async (req, res) => {
    res.status(200).json({
        authentication: true
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