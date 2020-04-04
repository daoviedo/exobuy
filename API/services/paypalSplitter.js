async function paypalSplitter(cart, storelist){
    let returnObj = {
        finalTotal: 0,
        payChain: []
    }
    let totaltransaction = 0;
    for (let x in cart){
        totaltransaction = totaltransaction + cart[x].TOTALITEM;
    }
    totaltransaction = (totaltransaction * 1.07) + 3;
    totaltransaction = totaltransaction.toFixed(2);
    returnObj.finalTotal = totaltransaction;
    for (let x in storelist){
        console.log(storelist[x])
        storelist[x].total = 0;
    }
    for (let item in cart){
        for(let store in storelist){
            if (cart[item].COD_TIENDA === storelist[store].COD_TIENDA){
                storelist[store].total = storelist[store].total + cart[item].TOTALITEM;
            }
        }
    }
    for (let x in storelist){
        storelist[x].total = (storelist[x].total * 0.93).toFixed(2);
    }

    let tempPayChain = [
        {
        email: "sb-tcg831211601@business.example.com",
        amount: totaltransaction,
        primary: "true"
        }
    ]
    for (let x in storelist){
        tempPayChain.push(
            {
                email: storelist[x].PAYPAL_EMAIL,
                amount: storelist[x].total,
                primary: "false"
            }
            );
    }
    returnObj.payChain = tempPayChain;

    return returnObj;
}

module.exports = paypalSplitter;