require('dotenv').config();
const database = require('../services/database.js');
const express = require('express');
const router = express.Router();

//route to get all municipalities
router.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    console.log(username, password)
});

module.exports = router;