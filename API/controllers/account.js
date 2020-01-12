require('dotenv').config();
const database = require('../services/database.js');
const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const router = express.Router();

//route to get all municipalities
router.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    console.log(username, password)
});

router.post('/register', async (req, res) => {
    const name = req.body.name
    const email = req.body.email;
    const password = req.body.password;

    const activationKey = crypto.randomBytes(32).toString('hex');
    const hash = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS));

    const result = await database.simpleExecute(`INSERT INTO OAUTH.USERS (USERS.ID, USERS.NAME, USERS.EMAIL, USERS.PASSWORD, USERS.ACTIVATION_TOKEN, USERS.CREATED_AT, USERS.UPDATED_AT) VALUES(NULL, '${name}', '${email}', '${hash}', '${activationKey}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`);
    if(result.hasOwnProperty('errorNum')){
        res.status(409).json({
            status: 0,
            message: "Email in use/other error"
        })
    }
    else{
        res.status(201).json({
            status: 1,
            message: "Account successfully Created"
        })
    }
});

router.get('/activate/:actKey', async (req, res) => {
    const actKey = req.params.actKey;
    
    const result = await database.simpleExecute(`UPDATE OAUTH.USERS SET USERS.ACTIVE=1, USERS.ACTIVATION_TOKEN='', USERS.EMAIL_VERIFIED_AT=CURRENT_TIMESTAMP, USERS.UPDATED_AT=CURRENT_TIMESTAMP WHERE USERS.ACTIVATION_TOKEN='${actKey}'`);

    res.status(200).json({
        data: result
    })
});

module.exports = router;