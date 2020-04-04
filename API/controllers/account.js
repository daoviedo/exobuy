require('dotenv').config();
const database = require('../services/database.js');
const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/checkAuth');
const transporter = require('../services/email.js')
const router = express.Router();

//Login Route
router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const findAccount = await database.simpleExecute(`SELECT * FROM OAUTH.USERS WHERE USERS.EMAIL='${email}'`);
    if(findAccount.rows.length === 0){
        res.status(401).json({
            statusCode: 0,
            message: "Failed to login, incorrect credentials"
        })
    }
    else{
        const match = await bcrypt.compare(password, findAccount.rows[0].PASSWORD);
 
        if(match) {
            const user = {
                ID: findAccount.rows[0].ID,
                name: findAccount.rows[0].NOMBRE_01_USUARIO,
                email: findAccount.rows[0].EMAIL,
            }
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
            res.status(200).json({
                statusCode: 1,
                token: token,
                message: "Successfully Logged in"
            })
            
        }
        else{
            res.status(401).json({
                statusCode: 0,
                message: "Failed to login, incorrect credentials"
            })
        }
    }
    
});

//Initial Registration Route
router.post('/register', async (req, res) => {
    const nombre1 = req.body.nombre1;
    const nombre2 = req.body.nombre2;
    const apellido1 = req.body.apellido1;
    const apellido2 = req.body.apellido2;

    const email = req.body.email;
    const password = req.body.password;

    const activationKey = crypto.randomBytes(32).toString('hex');
    const hash = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS));

    const result = await database.simpleExecute(`INSERT INTO OAUTH.USERS (USERS.ACTIVE, USERS.ID, USERS.NOMBRE_01_USUARIO, USERS.NOMBRE_02_USUARIO, USERS.APELLIDO_01_USUARIO, USERS.APELLIDO_02_USUARIO, USERS.EMAIL, USERS.PASSWORD, USERS.ACTIVATION_TOKEN, USERS.CREATED_AT, USERS.UPDATED_AT) VALUES(0, NULL, '${nombre1}', '${nombre2}', '${apellido1}', '${apellido2}', '${email}', '${hash}', '${activationKey}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`);
    if(result.hasOwnProperty('errorNum')){
        res.status(409).json({
            statusCode: 0,
            message: "Email in use/other error"
        })
    }
    else{
        const emailmessage = {
            from: 'api@myexobuy.com', // Sender address
            to: email,         // List of recipients
            subject: 'Activate your account', // Subject line
            text: 'Thank you for registering, please click the link below to activate your account\n' + process.env.WEB_ADDRESS + '/activate?key=' + activationKey
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
        
    }
});

router.put('/register', checkAuth, async (req, res) => {
    const userID = req.user.ID;

    const cod_pais = req.body.cod_pais;
    const cod_provincia = req.body.cod_provincia;
    const cod_municipio = req.body.cod_municipio;
    const cod_ciudad = req.body.cod_ciudad;

    const cod_tipo_id_usuario = req.body.cod_tipo_id_usuario;
    const id_usuario = req.body.id_usuario;

    const fecha_nac = req.body.fecha_nac;

    const cod_moneda = req.body.cod_moneda;

    const direccion_fisica = req.body.direccion_fisica;

    const num_telf = req.body.num_telf;

    //default COD_TIPO_USUARIO, COD_ROLE, COD_ESTATUS_USUARIO
    const result = await database.simpleExecute(`UPDATE EXOADM.USUARIOS SET USUARIOS.COD_PAIS='${cod_pais}', USUARIOS.COD_PROVINCIA=${cod_provincia}, USUARIOS.COD_MUNICIPIO=${cod_municipio}, USUARIOS.COD_CIUDAD=${cod_ciudad}, USUARIOS.COD_TIPO_ID_USUARIO=${cod_tipo_id_usuario}, USUARIOS.ID_USUARIO='${id_usuario}', USUARIOS.FECHA_NAC_USUARIO=TO_DATE('${fecha_nac}', 'mm/dd/yyyy'), USUARIOS.COD_MONEDA=${cod_moneda}, USUARIOS.DIRECCION_FISICA='${direccion_fisica}', USUARIOS.COD_TIPO_USUARIO=2, USUARIOS.COD_ROLE=2, USUARIOS.COD_ESTATUS_USUARIO=1, USUARIOS.NUM_TELF_USUARIO='${num_telf}' WHERE USUARIOS.COD_USUARIO=${userID}`);
    if(result.hasOwnProperty('errorNum')){
        res.status(409).json({
            statusCode: 0,
            message: "Error with data entry"
        })
    }
    else{
        res.status(200).json({
            statusCode: 1,
            message: "Account successfully updated"
        })
    }
});

//Route to activate email
router.patch('/activate/:actKey', async (req, res) => {
    const actKey = req.params.actKey;
    
    const result = await database.simpleExecute(`UPDATE OAUTH.USERS SET USERS.ACTIVE=1, USERS.ACTIVATION_TOKEN='', USERS.EMAIL_VERIFIED_AT=CURRENT_TIMESTAMP, USERS.UPDATED_AT=CURRENT_TIMESTAMP WHERE USERS.ACTIVATION_TOKEN='${actKey}'`);
    if (result.rowsAffected === 0){
        res.status(404).json({
            statusCode: 0,
            message: "Activation code expired/does not exist"
        })
    }
    else{
        res.status(200).json({
            statusCode: 1,
            message: "Activated successfully"
        })
    }
});

//Route to resend email
router.get('/resend', async (req, res) => {
    const email = req.query.email;
    const result = await database.simpleExecute(`SELECT USERS.ACTIVATION_TOKEN FROM OAUTH.USERS WHERE USERS.EMAIL='${email}'`);
    if(result.rows.length === 0){
        res.status(404).json({
            statusCode: 0,
            message: "email not found"
        })
    }
    else{
        if(result.rows[0].ACTIVATION_TOKEN === null){
            res.status(409).json({
                statusCode: 0,
                message: "email already activated"
            })
        }
        //problems with this on server
        else{
            const emailmessage = {
                from: 'api@myexobuy.com', // Sender address
                to: email,         // List of recipients
                subject: 'Activate your account', // Subject line
                text: 'Thank you for registering, please click the link below to activate your account\n' + process.env.WEB_ADDRESS + '/activate?key=' + result.rows[0].ACTIVATION_TOKEN
            };
            transporter.sendMail(emailmessage, function(err, info) {
                if(err) {
                    console.log(err);
                    
                    res.status(500).json({
                        statusCode: 0,
                        message: "something went wrong with email process"
                    })
                } else {
                    //console.log(info);
                    
                    res.status(200).json({
                        statusCode: 1,
                        message: "email resent"
                    })
                }
            });
            
        }
    }
});

//Route to get account information
router.get('/info', checkAuth, async (req, res) => {
    const userID = req.user.ID;
    const response = await database.simpleExecute(`SELECT * FROM EXOADM.USUARIOS WHERE USUARIOS.COD_USUARIO=${userID}`);
    res.status(200).json({
        info: response.rows[0]
    })
});

router.get('/socket', checkAuth, async (req, res) => {
    const userID = req.user.ID;
    const token = jwt.sign({ID: userID}, process.env.SOCKET_TOKEN, {expiresIn: "2 seconds"});

    const response = await database.simpleExecute(`UPDATE EXOSTO.CART SET CART.SESSION_TOKEN='${token}' WHERE CART.USER_ID=${userID} AND CART.CART_ACTIVE=1`);
    res.status(200).json({
        token: token,
        info: response
    })
});

module.exports = router;