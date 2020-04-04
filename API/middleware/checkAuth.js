require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
            if(err){
                res.status(401).json({
                    authentication: false
                })
            }
            else{
                req.user = decoded;
                next();
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