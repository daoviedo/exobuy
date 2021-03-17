const database = require('../services/database.js');
const checkAuth = require('../middleware/checkAuth');
const express = require('express');
const router = express.Router();

router.get('/', checkAuth, async (req, res) => {
    const user = req.user;
    const cartquery = await database.simpleExecute(`SELECT PRODUCTOS.IMG_URL, CART_DETAILS.DETAIL_ID, CART_DETAILS.COD_PRODUCTO, PRODUCTOS.PRODUCTO, PRODUCTOS.COSTO_PRODUCTO, PRODUCTOS.CANTIDAD_ACTUAL , CART_DETAILS.CANT_PRODUCTO, CASE WHEN PRODUCTOS.CANTIDAD_ACTUAL - CART_DETAILS.CANT_PRODUCTO < 0 THEN 1 ELSE 0 END AS EXCEEDS FROM EXOSTO.CART, EXOSTO.CART_DETAILS, EXOSTO.PRODUCTOS WHERE CART.CART_ID=CART_DETAILS.CART_ID AND CART_DETAILS.COD_PRODUCTO=PRODUCTOS.COD_PRODUCTO AND CART.USER_ID=${user.ID} AND CART.CART_ACTIVE=1 AND CART_DETAILS.ESTATUS_ITEM=1`);
    const costquery = await database.simpleExecute(`SELECT SUM(PRODUCTOS.COSTO_PRODUCTO * CART_DETAILS.CANT_PRODUCTO) AS TOTAL_COST FROM EXOSTO.CART, EXOSTO.CART_DETAILS, EXOSTO.PRODUCTOS WHERE CART.CART_ID=CART_DETAILS.CART_ID AND CART_DETAILS.COD_PRODUCTO=PRODUCTOS.COD_PRODUCTO AND CART.USER_ID=${user.ID} AND CART.CART_ACTIVE=1 AND CART_DETAILS.ESTATUS_ITEM=1`);
    res.status(200).json({
        cost: costquery.rows[0].TOTAL_COST,
        cart: cartquery.rows,
        delivery_fee: "0.00",
        tax: ((costquery.rows[0].TOTAL_COST + 0.3) * 1.029 - costquery.rows[0].TOTAL_COST).toFixed(2),
        order_total: ((costquery.rows[0].TOTAL_COST + 0.3) * 1.029).toFixed(2)
    })
});

router.get('/itemcount', checkAuth, async (req, res) => {
    const user = req.user;
    const cartquery = await database.simpleExecute(`SELECT SUM(CART_DETAILS.CANT_PRODUCTO) AS TOTAL FROM EXOSTO.CART INNER JOIN EXOSTO.CART_DETAILS ON CART.CART_ID=CART_DETAILS.CART_ID WHERE CART.USER_ID=${user.ID} AND CART_DETAILS.ESTATUS_ITEM=1`);
    res.status(200).json({
        itemcount: cartquery.rows[0].TOTAL
    })
});

router.post('/', checkAuth, async (req, res) => {
    const user = req.user;
    const cod_producto = req.body.cod_producto;
    const cantidad = req.body.cantidad;
    const cart = await database.simpleExecute(
        `SELECT CART.CART_ID, CART_DETAILS.DETAIL_ID, CART_DETAILS.COD_PRODUCTO, CART_DETAILS.CANT_PRODUCTO, PRODUCTOS.COD_PRODUCTO, PRODUCTOS.COD_TIENDA, PRODUCTOS.COSTO_PRODUCTO*CART_DETAILS.CANT_PRODUCTO AS TOTALITEM FROM EXOSTO.CART, EXOSTO.CART_DETAILS, EXOSTO.PRODUCTOS WHERE CART.CART_ID=CART_DETAILS.CART_ID AND CART.USER_ID=${user.ID} AND CART.CART_ACTIVE=1 AND CART_DETAILS.ESTATUS_ITEM=1 AND CART_DETAILS.COD_PRODUCTO=PRODUCTOS.COD_PRODUCTO`
      );
    const prod = await database.simpleExecute(
        `SELECT * FROM EXOSTO.PRODUCTOS WHERE PRODUCTOS.COD_PRODUCTO=${cod_producto}`
      );

    let selected = null;
    for (let inv in cart.rows){
        if (cart.rows[inv].CART_ACTIVE !==0){
            selected = cart.rows[inv]
        }
    }

    if(cart.rows.length === 0 || selected === null || selected.COD_TIENDA === prod.rows[0].COD_TIENDA){
        const result = await database.simpleExecute(`CALL EXOSTO.ADDCART(${user.ID},${cod_producto},${cantidad})`);
        res.status(200).json({
            statusCode: 1,
            result: result
        })
    }
    else{
        res.status(401).json({
            statusCode: 0,
            result: "diff stores"
        })
    }
});

router.patch('/', checkAuth, async (req, res) => {
    const user = req.user;
    const detail_id = req.body.detail_id;
    const cantidad = req.body.cantidad;
    const result = await database.simpleExecute(`CALL EXOSTO.MODIFYCART(${user.ID},${detail_id},${cantidad})`);
    res.status(200).json({
        statusCode: 1,
        result: result
    })
});

module.exports = router;