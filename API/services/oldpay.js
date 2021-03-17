const payload = {
    requestEnvelope: {
      errorLanguage: "en_US"
    },
    actionType: "PAY",
    currencyCode: "USD",
    feesPayer: "EACHRECEIVER",
    memo: "Chained payment example",
    cancelUrl: "https://www.dev.myexobuy.com/cart",
    returnUrl: "https://www.dev.myexobuy.com",
    receiverList: {
      receiver: paysplit.payChain
    }
  };

  let params;

  paypalSdk.pay(payload, async function(err, response) {
    if (err) {
      console.log(err);
      socket.emit("status", {
        statusCode: 0,
        message: "paypal service failed, try again"
      });
      socket.disconnect();
    } else {
      // But also a paymentApprovalUrl, so you can redirect the sender to checkout easily
      console.log(response.paymentApprovalUrl);
      socket.emit("paypallink", { link: response.paymentApprovalUrl });
      params = {
        payKey: response.payKey
      };
    }
  });

  checkpaid = setInterval(async function() {
    paypalSdk.paymentDetails(params, async function(err, response) {
      if (err) {
        console.log(err);
      } else {
        // payments details for this payKey, transactionId or trackingId
        // console.log(response.paymentInfoList.paymentInfo[0].senderTransactionId);
        if (response.status === "COMPLETED") {
          clearInterval(checkpaid);
          const finishCart = await database.simpleExecute(
            `CALL EXOSTO.FINISHCART(${cartID})`
          );
          const createOrder = await database.simpleExecute(
            `INSERT INTO EXOSTO.ORDERS (ORDERS.ORDER_ID, ORDERS.CART_ID, ORDERS.TOTAL_PRICE, ORDERS.STATUS, ORDERS.TIME_ORDERED, ORDERS.USER_ID, ORDERS.TRANSACTION_ID) VALUES(null, ${cartID}, ${paysplit.finalTotal}, 0, CURRENT_TIMESTAMP, ${userID}, '${response.paymentInfoList.paymentInfo[0].senderTransactionId}')`
          );
          paymentComplete = true;
          socket.emit("status", {
            statusCode: 1,
            message: "successfully purchased"
          });
          //remove
          clearInterval(checkpaid);
          socket.disconnect();
        }
      }
    });
  }, 5000);