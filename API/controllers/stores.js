const database = require('../services/database.js');
const checkAdmin = require('../middleware/checkAdmin');
const checkVendor = require('../middleware/checkVendor');
const express = require('express');
const router = express.Router();

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() +  file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({
    storage: storage,
    limits: {fileSize: 1024 * 1024 * 5},
    fileFilter: fileFilter
});


//STORE SEARCH
router.get('/search', async (req, res) => {
    const result = await database.simpleExecute('SELECT * FROM EXOSTO.TIENDAS');
    res.status(200).json({
        data: result.rows
    })
});
router.get('/search/:filter', async (req, res) => {
    const qf = req.params.filter;
    const result = await database.simpleExecute(`SELECT * FROM EXOSTO.TIENDAS WHERE LOWER(TIENDAS.TIENDA) LIKE '${qf}%'`);
    res.status(200).json({
        data: result.rows
    })
});
router.get('/search/category/:category', async (req, res) => {
    const category = req.params.category;
    const result = await database.simpleExecute(`SELECT * FROM EXOSTO.TIENDAS WHERE TIENDAS.COD_MERCADO=${category}`);
    res.status(200).json({
        data: result.rows
    })
});
router.get('/search/category/:category/:filter', async (req, res) => {
    const qf = req.params.filter;
    const cat = req.params.category;
    const result = await database.simpleExecute(`SELECT * FROM EXOSTO.TIENDAS WHERE LOWER(TIENDAS.TIENDA) LIKE '${qf}%' AND TIENDAS.COD_MERCADO=${cat}`);
    res.status(200).json({
        data: result.rows
    })
});


//MERCADOS - TIPO DE MERCADOS
router.get('/mercados', async (req, res) => {
    const result = await database.simpleExecute('SELECT * FROM EXOADM.MERCADOS');
    res.status(200).json({
        data: result.rows
    })
});
router.post('/mercados', checkAdmin, async (req, res) => {
    const mercado = req.body.mercado;
    const result = await database.simpleExecute(`INSERT INTO EXOADM.MERCADOS (MERCADOS.MERCADO, MERCADOS.LIMITE_MAXIMO) VALUES('${mercado}', 5)`);
    res.status(200).json({
        statusCode: 1,
        result: result
    })
});
router.patch('/mercados', checkAdmin, async (req, res) => {
    const mercado_id = req.body.mercado_id;
    const mercado = req.body.mercado;
    const result = await database.simpleExecute(`UPDATE EXOADM.MERCADOS SET MERCADOS.MERCADO='${mercado}' WHERE MERCADOS.COD_MERCADO=${mercado_id}`);
    res.status(200).json({
        statusCode: 1,
        result: result
    })
});

//STORE INFO WITH STORE ID
router.get('/details/:id', async (req, res) => {
    const storeID= req.params.id;
    const result = await database.simpleExecute(`SELECT * FROM EXOSTO.TIENDAS WHERE TIENDAS.COD_TIENDA=${storeID}`);
    res.status(200).json({
        data: result.rows
    })
});


//CREATE NEW STORE
router.post('/create', checkVendor, upload.single('productImage'), async (req, res) => {
    const user = req.user;
    const nombre_tienda = req.body.nombre_tienda;
    const cod_mercado = req.body.cod_mercado;
    const direccion = req.body.direccion;
    const detalle = req.body.detalle;
    const num_telf = req.body.num_telf;
    const paypal_email = req.body.paypal_email;
    
    let img_url;
    if (req.file === undefined){
        img_url = 'https://api.dev.myexobuy.com/uploads/2020-02-19T00:05:15.792Ztestlogo.png';
    }
    else{
        img_url = 'https://api.dev.myexobuy.com/' + req.file.path;
    }

    const result = await database.simpleExecute(`INSERT INTO EXOSTO.TIENDAS (TIENDAS.TIENDA, TIENDAS.COD_USUARIO, TIENDAS.FECHA_INICIO_TIENDA, TIENDAS.COD_MERCADO, TIENDAS.DIRECCION_FISICA, TIENDAS.TIENDA_DETALLE, TIENDAS.NUM_TELF, TIENDAS.IMG_URL, TIENDAS.ACTIVO, TIENDAS.PAYPAL_EMAIL) VALUES('${nombre_tienda}', ${user.ID}, CURRENT_DATE, ${cod_mercado}, '${direccion}', '${detalle}', '${num_telf}', '${img_url}', 0, '${paypal_email}')`);
    res.status(200).json({
        statusCode: 1,
        result: result
    })
});

//GET/POST STORE CATEGORIES
router.post('/categories', checkVendor, async (req, res) => {
    const category = req.body.category;
    const cod_tienda = req.body.cod_tienda;
    const result = await database.simpleExecute(`INSERT INTO EXOSTO.CATEGORIAS_PRODUCTOS (CATEGORIAS_PRODUCTOS.CATEGORIA_PRODUCTO, CATEGORIAS_PRODUCTOS.COD_TIENDA, CATEGORIAS_PRODUCTOS.ACTIVO) VALUES('${category}', ${cod_tienda}, 0)`);
    res.status(200).json({
        statusCode: 1,
        result: result
    })
});
router.patch('/categories', checkVendor, async (req, res) => {
    const category = req.body.category;
    const cod_cat = req.body.cod_cat;
    const result = await database.simpleExecute(`UPDATE EXOSTO.CATEGORIAS_PRODUCTOS SET CATEGORIAS_PRODUCTOS.CATEGORIA_PRODUCTO='${category}' WHERE CATEGORIAS_PRODUCTOS.COD_CATEGORIA_PRODUCTO=${cod_cat}`);
    res.status(200).json({
        statusCode: 1,
        result: result
    })
});
router.get('/categories/:tienda', async (req, res) => {
    const tienda = req.params.tienda;
    const result = await database.simpleExecute(`SELECT * FROM EXOSTO.CATEGORIAS_PRODUCTOS WHERE CATEGORIAS_PRODUCTOS.COD_TIENDA=${tienda}`);
    res.status(200).json({
        data: result.rows
    })
});


//PRODUCT SEARCH
router.get('/products/:tienda', async (req, res) => {
    const tienda = req.params.tienda;
    const result = await database.simpleExecute(`SELECT * FROM EXOSTO.PRODUCTOS WHERE PRODUCTOS.COD_TIENDA=${tienda}`);
    res.status(200).json({
        data: result.rows
    })
});
router.get('/products/:tienda/:filter', async (req, res) => {
    const tienda = req.params.tienda;
    const filter = req.params.filter;
    const result = await database.simpleExecute(`SELECT * FROM EXOSTO.PRODUCTOS WHERE PRODUCTOS.COD_TIENDA=${tienda} AND LOWER(PRODUCTOS.PRODUCTO) LIKE '%${filter}%'`);
    res.status(200).json({
        data: result.rows
    })
});
router.get('/products/category/:tienda/:category', async (req, res) => {
    const tienda = req.params.tienda;
    const category = req.params.category;
    const result = await database.simpleExecute(`SELECT * FROM EXOSTO.PRODUCTOS WHERE PRODUCTOS.COD_TIENDA=${tienda} AND PRODUCTOS.COD_CATEGORIA_PRODUCTO=${category}`);
    res.status(200).json({
        data: result.rows
    })
});
router.get('/products/category/:tienda/:category/:filter', async (req, res) => {
    const tienda = req.params.tienda;
    const category = req.params.category;
    const filter = req.params.filter;
    const result = await database.simpleExecute(`SELECT * FROM EXOSTO.PRODUCTOS WHERE PRODUCTOS.COD_TIENDA=${tienda} AND PRODUCTOS.COD_CATEGORIA_PRODUCTO=${category} AND LOWER(PRODUCTOS.PRODUCTO) LIKE '%${filter}%'`);
    res.status(200).json({
        data: result.rows
    })
});

router.post('/testimage', checkVendor, upload.single('productImage'), async (req, res) => {
    console.log(req.file);
    const {test, var1} = req.body;

    console.log(test, var1);
    res.status(200).json({
        url: 'https://api.dev.myexobuy.com/' + req.file.path
    })
});


//CREATE NEW PRODUCT
router.post('/products', checkVendor, upload.single('productImage'), async (req, res) => {
    const producto = req.body.producto;
    const cod_tienda = req.body.cod_tienda;
    const costo_producto = req.body.costo_producto;
    const peso_producto = req.body.peso_producto;
    const cantidad = req.body.cantidad;
    const cod_categoria_producto = req.body.cod_categoria_producto;
    const cod_barra = req.body.cod_barra;
    const cod_tipo_unidad = 1;
    const detalle = req.body.detalle;

    let img_url;
    if (req.file === undefined){
        img_url = 'https://api.dev.myexobuy.com/uploads/2020-02-19T00:05:15.792Ztestlogo.png';
    }
    else{
        img_url = 'https://api.dev.myexobuy.com/' + req.file.path;
    }

    const result = await database.simpleExecute(`INSERT INTO EXOSTO.PRODUCTOS (PRODUCTOS.PRODUCTO, PRODUCTOS.COD_TIENDA, PRODUCTOS.COSTO_PRODUCTO, PRODUCTOS.PESO_PRODUCTO, PRODUCTOS.CANTIDAD_ACTUAL, PRODUCTOS.COD_CATEGORIA_PRODUCTO, PRODUCTOS.COD_BARRA, PRODUCTOS.COD_TIPO_UNIDAD, PRODUCTOS.PRODUCTO_DETALLE, PRODUCTOS.IMG_URL, PRODUCTOS.ACTIVO) VALUES('${producto}', ${cod_tienda}, ${costo_producto}, ${peso_producto}, ${cantidad}, ${cod_categoria_producto}, '${cod_barra}', ${cod_tipo_unidad}, '${detalle}', '${img_url}', 0)`);
    res.status(200).json({
        statusCode: 1,
        result: result
    })
});


//VENDER GET THEIR STORES
router.get('/vendor', checkVendor, async (req, res) => {
    const user = req.user;
    if(user.access === 5){
        query = `SELECT * FROM EXOSTO.TIENDAS ORDER BY TIENDAS.COD_MERCADO, TIENDAS.TIENDA`;
    }
    else{
        query = `SELECT * FROM EXOSTO.TIENDAS WHERE TIENDAS.COD_USUARIO=${user.ID} ORDER BY TIENDAS.COD_MERCADO, TIENDAS.TIENDA`;
    }
    const result = await database.simpleExecute(query);
    res.status(200).json({
        data: result.rows
    })
});

router.patch('/vendor', checkVendor, async (req, res) => {
    const user = req.user;
    const { cod_tienda, tienda, direccion, tienda_detalle, num_telf } = req.body;
    const result = await database.simpleExecute(`UPDATE EXOSTO.TIENDAS SET TIENDAS.TIENDA='${tienda}', TIENDAS.TIENDA_DETALLE='${tienda_detalle}', TIENDAS.DIRECCION_FISICA='${direccion}', TIENDAS.NUM_TELF='${num_telf}' WHERE TIENDAS.COD_TIENDA=${cod_tienda}`);
    res.status(200).json({
        statusCode: 1,
        result: result
    })
})

router.patch('/vendorimg', checkVendor, upload.single('productImage'), async (req, res) => {
    const user = req.user;
    const { cod_tienda, tienda, direccion, tienda_detalle, num_telf } = req.body;
    const img_url = 'https://api.dev.myexobuy.com/' + req.file.path;
    const result = await database.simpleExecute(`UPDATE EXOSTO.TIENDAS SET TIENDAS.TIENDA='${tienda}', TIENDAS.TIENDA_DETALLE='${tienda_detalle}', TIENDAS.DIRECCION_FISICA='${direccion}', TIENDAS.NUM_TELF='${num_telf}', TIENDAS.IMG_URL='${img_url}' WHERE TIENDAS.COD_TIENDA=${cod_tienda}`);
    res.status(200).json({
        statusCode: 1,
        result: result
    })
})

router.get('/productfinder/inventoryhold/:item', checkVendor, async (req, res) => {
    const item = req.params.item;
    const result = await database.simpleExecute(`SELECT SUM(CART_DETAILS.CANT_PRODUCTO) AS HOLD FROM EXOSTO.CART_DETAILS WHERE CART_DETAILS.COD_PRODUCTO=${item} AND CART_DETAILS.ESTATUS_ITEM=3`);
    if(result.rows[0].HOLD === null){
        res.status(200).json({
            value: 0
        })
    }
    else{
        res.status(200).json({
            value: result.rows[0].HOLD
        })
    }
});

router.patch('/updateproduct/price/:item', checkVendor, async (req, res) => {
    const item = req.params.item;
    const { newPrice } = req.body;
    const result = await database.simpleExecute(`UPDATE EXOSTO.PRODUCTOS SET PRODUCTOS.COSTO_PRODUCTO=${newPrice} WHERE PRODUCTOS.COD_PRODUCTO=${item}`);
    res.status(200).json({
        statusCode: 1,
        result: result
    })
})


router.patch('/updateproduct/inventory/:item', checkVendor, async (req, res) => {
    const item = req.params.item;
    const { invUpdate } = req.body;
    const result = await database.simpleExecute(`UPDATE EXOSTO.PRODUCTOS SET PRODUCTOS.CANTIDAD_ACTUAL=PRODUCTOS.CANTIDAD_ACTUAL+${invUpdate} WHERE PRODUCTOS.COD_PRODUCTO=${item}`);
    res.status(200).json({
        statusCode: 1,
        result: result
    })
})

router.patch('/productimg', checkVendor, upload.single('productImage'), async (req, res) => {
    const product_id = req.body.product_id;
    const img_url = 'https://api.dev.myexobuy.com/' + req.file.path;
    const result = await database.simpleExecute(`UPDATE EXOSTO.PRODUCTOS SET PRODUCTOS.IMG_URL='${img_url}' WHERE PRODUCTOS.COD_PRODUCTO=${product_id}`);
    res.status(200).json({
        statusCode: 1,
        result: result
    })
})

router.patch('/disable/store', checkAdmin, async (req, res) => {
    const { cod_tienda, newActive } = req.body;
    const result = await database.simpleExecute(`UPDATE EXOSTO.TIENDAS SET TIENDAS.ACTIVO=${newActive} WHERE TIENDAS.COD_TIENDA=${cod_tienda}`);
    res.status(200).json({
        statusCode: 1,
        result: result
    })
})

router.patch('/disable/category', checkAdmin, async (req, res) => {
    const { cod_categoria, newActive } = req.body;
    const result = await database.simpleExecute(`UPDATE EXOSTO.CATEGORIAS_PRODUCTOS SET CATEGORIAS_PRODUCTOS.ACTIVO=${newActive} WHERE CATEGORIAS_PRODUCTOS.COD_CATEGORIA_PRODUCTO=${cod_categoria}`);
    res.status(200).json({
        statusCode: 1,
        result: result
    })
})

router.patch('/disable/product', checkAdmin, async (req, res) => {
    const { cod_producto, newActive } = req.body;
    const result = await database.simpleExecute(`UPDATE EXOSTO.PRODUCTOS SET PRODUCTOS.ACTIVO=${newActive} WHERE PRODUCTOS.COD_PRODUCTO=${cod_producto}`);
    res.status(200).json({
        statusCode: 1,
        result: result
    })
})

module.exports = router;