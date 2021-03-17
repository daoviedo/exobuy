const database = require('../services/database.js');
const checkAuth = require('../middleware/checkAuth');
const checkVendor = require('../middleware/checkVendor');
const checkDelivery = require('../middleware/checkDelivery');
const express = require('express');
const router = express.Router();

router.get('/', checkAuth, async (req, res) => {
    const user = req.user;
    const query = await database.simpleExecute(`SELECT ORDER_ID, ORDERS.CART_ID, TOTAL_PRICE, STATUS, ORDERS.TIME_ORDERED, USER_ID, TRANSACTION_ID, TIENDAS.IMG_URL FROM EXOSTO.ORDERS INNER JOIN EXOSTO.ORDER_DETAILS ON ORDERS.CART_ID=ORDER_DETAILS.CART_ID INNER JOIN EXOSTO.TIENDAS ON ORDER_DETAILS.COD_TIENDA=TIENDAS.COD_TIENDA WHERE ORDERS.USER_ID=${user.ID} GROUP BY ORDER_ID, ORDERS.CART_ID, TOTAL_PRICE, STATUS, ORDERS.TIME_ORDERED, USER_ID, TRANSACTION_ID, TIENDAS.IMG_URL ORDER BY TIME_ORDERED DESC`);
    res.status(200).json({
        data: query.rows
    })
});

router.get('/details/:cart_id', checkAuth, async (req, res) => {
    const cart_id = req.params.cart_id;
    const query = await database.simpleExecute(`SELECT * FROM EXOSTO.ORDER_DETAILS WHERE CART_ID=${cart_id} ORDER BY COD_TIENDA`);
    res.status(200).json({
        data: query.rows
    })
});

router.get('/orderlist/:store_id', checkVendor, async (req, res) => {
    const user = req.user;
    const store_id = req.params.store_id;
    const querycheck = await database.simpleExecute(`SELECT * FROM EXOSTO.TIENDAS WHERE COD_TIENDA=${store_id} AND COD_USUARIO=${user.ID}`);
    if(querycheck.rows.length === 0 && user.access !== 5){
        res.status(401).json({
            authentication: false
        })
    }
    else{
        const query = await database.simpleExecute(`SELECT ORDER_ID, ORDER_DETAILS.TIME_ORDERED, ORDER_DETAILS.CART_ID, STATUS, SUM(CANT_PRODUCTO) AS ITEMCOUNT FROM EXOSTO.ORDER_DETAILS INNER JOIN EXOSTO.ORDERS ON ORDERS.CART_ID=ORDER_DETAILS.CART_ID WHERE COD_TIENDA=${store_id} GROUP BY ORDER_ID, ORDER_DETAILS.CART_ID, ORDER_DETAILS.TIME_ORDERED, STATUS ORDER BY ORDER_DETAILS.TIME_ORDERED`);
        res.status(200).json({
            data: query.rows
        })
    }
});

router.get('/orderdetails/:store_id/:cart_id', checkVendor, async (req, res) => {
    const store_id = req.params.store_id;
    const cart_id = req.params.cart_id;
    const query = await database.simpleExecute(`SELECT * FROM EXOSTO.ORDER_DETAILS WHERE COD_TIENDA=${store_id} AND CART_ID=${cart_id}`);
    res.status(200).json({
        data: query.rows
    })
});

router.get('/delivery', checkDelivery, async (req, res) => {
    const query = await database.simpleExecute(`SELECT ORDER_ID, ORDERS.CART_ID, TOTAL_PRICE, STATUS, ORDERS.TIME_ORDERED, USER_ID, TRANSACTION_ID, ORDER_DETAILS.COD_TIENDA, NOMBRE_01_USUARIO, APELLIDO_01_USUARIO, ID_USUARIO, USUARIOS.DIRECCION_FISICA AS DIRECCION_USUARIO, LATITUD_USUARIO, LONGITUD_USUARIO, NUM_TELF_USUARIO, TIENDAS.DIRECCION_FISICA AS DIRECCION_TIENDA, NUM_TELF AS NUM_TELF_TIENDA, TIENDAS.IMG_URL FROM EXOSTO.ORDERS INNER JOIN EXOSTO.ORDER_DETAILS ON ORDERS.CART_ID=ORDER_DETAILS.CART_ID INNER JOIN EXOADM.USUARIOS ON ORDERS.USER_ID=USUARIOS.COD_USUARIO INNER JOIN EXOSTO.TIENDAS ON ORDER_DETAILS.COD_TIENDA=TIENDAS.COD_TIENDA WHERE STATUS<>3 GROUP BY ORDER_ID, ORDERS.CART_ID, TOTAL_PRICE, STATUS, ORDERS.TIME_ORDERED, USER_ID, TRANSACTION_ID, ORDER_DETAILS.COD_TIENDA, NOMBRE_01_USUARIO, APELLIDO_01_USUARIO, ID_USUARIO, USUARIOS.DIRECCION_FISICA, LATITUD_USUARIO, LONGITUD_USUARIO, NUM_TELF_USUARIO, TIENDAS.DIRECCION_FISICA, NUM_TELF, TIENDAS.IMG_URL ORDER BY ORDERS.TIME_ORDERED`);
    res.status(200).json({
        data: query.rows
    })
});

router.get('/delivery/:cart', checkDelivery, async (req, res) => {
    const cart = req.params.cart;
    const query = await database.simpleExecute(`SELECT * FROM EXOSTO.ORDER_DETAILS WHERE CART_ID=${cart}`);
    res.status(200).json({
        data: query.rows
    })
});

router.patch('/delivery/status', checkDelivery, async (req, res) => {
    const {order_id, status} = req.body;
    const result = await database.simpleExecute(`UPDATE EXOSTO.ORDERS SET ORDERS.STATUS=${status} WHERE ORDERS.ORDER_ID=${order_id}`);
    res.status(200).json({
        statusCode: 1,
        result: result
    })
});

//test
router.patch('/vendor/status', checkVendor, async (req, res) => {
    const {order_id} = req.body;
    const result = await database.simpleExecute(`UPDATE EXOSTO.ORDERS SET ORDERS.STATUS=1 WHERE ORDERS.ORDER_ID=${order_id}`);
    res.status(200).json({
        statusCode: 1,
        result: result
    })
});

module.exports = router;