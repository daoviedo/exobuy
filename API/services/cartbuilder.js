async function cartbuilder(cart, sign){
    let begquery = `UPDATE EXOSTO.PRODUCTOS SET PRODUCTOS.CANTIDAD_ACTUAL = CASE `;
    let codarray = [];
    let midquery = "";
    for(i in cart){
        midquery = midquery + `WHEN PRODUCTOS.COD_PRODUCTO=${cart[i].COD_PRODUCTO} THEN PRODUCTOS.CANTIDAD_ACTUAL${sign}${cart[i].CANT_PRODUCTO} `
        codarray.push(cart[i].COD_PRODUCTO);
    }
    let strout = "(" + codarray + ")";
    let finquery = `END WHERE PRODUCTOS.COD_PRODUCTO IN ` + strout;

    return begquery + midquery + finquery;
}

module.exports = cartbuilder;