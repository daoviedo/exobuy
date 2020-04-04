const database = require('../services/database.js');
const checkAuth = require('../middleware/checkAuth');
const checkVendor = require('../middleware/checkVendor');
const express = require('express');
const router = express.Router();

router.get('/', checkAuth, async (req, res) => {
    const user = req.user;
    const query = await database.simpleExecute(`SELECT * FROM EXOSTO.ORDERS WHERE ORDERS.USER_ID=${user.ID}`);
    res.status(200).json({
        data: query.rows
    })
});

router.get('/details/:cart_id', checkAuth, async (req, res) => {
    const user = req.user;
    const cart_id = req.params.cart_id;
    const query = await database.simpleExecute(`SELECT * FROM EXOSTO.ORDER_DETAILS WHERE CART_ID=${cart_id} ORDER BY COD_TIENDA`);
    res.status(200).json({
        data: query.rows
    })
});

router.get('/orderlist/:store_id', checkVendor, async (req, res) => {
    const user = req.user;
    const store_id = req.params.store_id;
    const query = await database.simpleExecute(`SELECT TIME_ORDERED, CART_ID, COUNT(*) AS ITEMCOUNT FROM EXOSTO.ORDER_DETAILS WHERE COD_TIENDA=${store_id} GROUP BY CART_ID, TIME_ORDERED ORDER BY TIME_ORDERED`);
    res.status(200).json({
        data: query.rows
    })
});

module.exports = router;