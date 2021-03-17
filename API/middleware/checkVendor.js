require('dotenv').config();
const database = require('../services/database.js');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async function(err, decoded) {
            if(err){
                res.status(401).json({
                    authentication: false
                })
            }
            else{
                const user = decoded;
                const result = await database.simpleExecute(`SELECT USUARIOS.COD_TIPO_USUARIO FROM EXOADM.USUARIOS WHERE USUARIOS.COD_USUARIO=${user.ID}`);
                if(result.rows[0].COD_TIPO_USUARIO === 3 || result.rows[0].COD_TIPO_USUARIO === 5){
                    req.user = user;
                    req.user.access = result.rows[0].COD_TIPO_USUARIO;
                    next();
                }
                else{
                    res.status(401).json({
                        authentication: false
                    })
                }
                
            }
        // err
        // decoded undefined
        });
    }
    catch(err){
        res.status(401).json({
            authentication: false
        })
    }
    
}