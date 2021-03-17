const database = require('../services/database.js');
const checkAdmin = require('../middleware/checkAdmin');
const bcrypt = require('bcrypt');
const express = require('express');
const transporter = require('../services/email.js');
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

router.get('/currentowner/:store_id', async (req, res) => {
    const store_id = req.params.store_id;
    const result = await database.simpleExecute(`SELECT EMAIL_USUARIO FROM EXOSTO.TIENDAS INNER JOIN EXOADM.USUARIOS ON TIENDAS.COD_USUARIO = USUARIOS.COD_USUARIO WHERE COD_TIENDA=${store_id}`);
    res.json({
        data: result.rows[0].EMAIL_USUARIO
    })
});

router.post('/newvendor', checkAdmin, async (req, res) => {
    const email = req.body.email.toLowerCase();
    const store_id = req.body.store_id;

    const findAccount = await database.simpleExecute(`SELECT ID, USERS.EMAIL FROM OAUTH.USERS WHERE USERS.EMAIL='${email}'`);
    if(findAccount.rows.length === 0){
        //create account for new vendor
        const values = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()_+";
        let password = "";
        for(let i = 0; i < 6; i++){
            password = password + values.charAt(Math.floor(Math.random() * Math.floor(values.length - 1)))
        }
        const hash = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS));
        
        const userCreation = await database.simpleExecute(`INSERT INTO OAUTH.USERS (USERS.ACTIVE, USERS.ID, USERS.EMAIL, USERS.PASSWORD, USERS.CREATED_AT, USERS.UPDATED_AT) VALUES(1, NULL, '${email}', '${hash}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`);
        
        const newid = await database.simpleExecute(`SELECT USERS.ID FROM OAUTH.USERS WHERE USERS.EMAIL='${email}'`);
        const addingMiembro = await database.simpleExecute(`INSERT INTO EXOADM.MIEMBROS (MIEMBROS.COD_USUARIO, MIEMBROS.FECHA_SUSC_MIEMBRO, MIEMBROS.COD_MEMBRESIA, MIEMBROS.COD_ESTATUS_MEMBRESIA) VALUES(${newid.rows[0].ID}, CURRENT_DATE, 1, 1)`);
        const setStoreOwner = await database.simpleExecute(`UPDATE EXOSTO.TIENDAS SET COD_USUARIO = ${newid.rows[0].ID} WHERE TIENDAS.COD_TIENDA = ${store_id}`);
        
        const emailmessage = {
            from: '"EXO|BUY" <api@myexobuy.com>', // Sender address
            to: email,         // List of recipients
            subject: 'Bienvenido a EXO|BUY-Vendedor', // Subject line
            text: 'Tu cuenta estuvo creado y abajo estan tus credenciales para logiar\n' + 'email: ' + email + '\npassword: ' + password
        };
        transporter.sendMail(emailmessage, function(err, info) {
            if (err) {
                console.log(err);
                res.status(400).json({
                    statusCode: 0,
                    message: "Email does not exist/is not a valid email"
                })
            } else {
                //console.log(info);
                res.status(201).json({
                    statusCode: 1,
                    message: "Account successfully created"
                })
            }
        });

    }else{
        const setStoreOwner = await database.simpleExecute(`UPDATE EXOSTO.TIENDAS SET COD_USUARIO = ${findAccount.rows[0].ID} WHERE TIENDAS.COD_TIENDA = ${store_id}`);
        res.status(201).json({
            statusCode: 1,
            message: "Account successfully transfered"
        })
    }
    
});

module.exports = router;