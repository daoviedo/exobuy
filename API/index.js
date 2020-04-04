require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const database = require("./services/database.js");
const bodyParser = require("body-parser");

const areaRoutes = require("./controllers/area");
const accountRoutes = require("./controllers/account");
const verificationRoutes = require("./controllers/verification");
const storeRoutes = require("./controllers/stores");
const cartRoutes = require("./controllers/cart");
const orderRoutes = require("./controllers/order");
const adminRoutes = require("./controllers/admin");

const cartbuilder = require("./services/cartbuilder.js");
const paypalSplitter = require("./services/paypalSplitter");
const paypalSdk = require("./services/paypal");

const http = require("http");
const socketIo = require("socket.io");
const socketIoJwt = require("socketio-jwt");

const app = express();

async function startup() {
  try {
    console.log("Initializing database module");

    await database.initialize();
  } catch (err) {
    console.error(err);

    process.exit(1); // Non-zero failure code
  }

  // *** existing try block in startup here ***
}
startup();

app.use(helmet());
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.headers.origin === undefined) {
    if (req.headers["api-key"] === process.env.API_KEY) {
      next();
    } else {
      res.status(401).json({});
    }
  } else {
    next();
  }
});

//Controllers
app.use("/area", areaRoutes);
app.use("/account", accountRoutes);
app.use("/verify", verificationRoutes);
app.use("/stores", storeRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/admin", adminRoutes);

app.get("/testcomplete", async (req, res) => {
  const payKey = req.query.paykey;
  console.log(payKey);
  res.send("here");
});

app.get("/test", async (req, res) => {
  var payload = {
    requestEnvelope: {
        errorLanguage:  'en_US'
    },
    actionType:     'PAY',
    currencyCode:   'USD',
    feesPayer:      'EACHRECEIVER',
    memo:           'Chained payment example',
    cancelUrl:      'http://test.com/cancel',
    returnUrl:      'http://test.com/success',
    receiverList: {
        receiver: [
            {
                email:  'sb-oao8o1211844@business.example.com',
                amount: '100.00',
                primary:'true'
            },
            {
                email:  'sb-g1nt471245853@business.example.com',
                amount: '10.00',
                primary:'false'
            }
        ]
    }
};
 
paypalSdk.pay(payload, function (err, response) {
    if (err) {
        console.log(err);
        console.log(response);
    } else {
        // Response will have the original Paypal API response
        console.log(response);
        // But also a paymentApprovalUrl, so you can redirect the sender to checkout easily
        console.log('Redirect to %s', response.paymentApprovalUrl);
    }
});
});

const server = http.createServer(app);

const io = socketIo(server);

io.use(
  socketIoJwt.authorize({
    secret: process.env.SOCKET_TOKEN,
    handshake: true
  })
);

//socket logic
io.on("connection", async socket => {
  console.log("connected");
  const token = socket.handshake.query.token;
  const userID = socket.decoded_token.ID;
  const dbSession = await database.simpleExecute(
    `SELECT CART.SESSION_TOKEN FROM EXOSTO.CART WHERE CART.USER_ID=${userID} AND CART.CART_ACTIVE=1`
  );
  let cart;
  let cost;
  let paymentComplete = false;
  let cartFailed = false;
  let checkpaid;
  if (dbSession.rows[0].SESSION_TOKEN === token && token !== "") {
    const removeToken = await database.simpleExecute(
      `UPDATE EXOSTO.CART SET CART.SESSION_TOKEN='' WHERE CART.USER_ID=${userID} AND CART.CART_ACTIVE=1`
    );
    console.log("a user connected");
    socket.emit("step1", "complete");
    socket.on("cart", async () => {

      const costquery = await database.simpleExecute(
        `SELECT SUM(PRODUCTOS.COSTO_PRODUCTO * CART_DETAILS.CANT_PRODUCTO) AS TOTAL_COST FROM EXOSTO.CART, EXOSTO.CART_DETAILS, EXOSTO.PRODUCTOS WHERE CART.CART_ID=CART_DETAILS.CART_ID AND CART_DETAILS.COD_PRODUCTO=PRODUCTOS.COD_PRODUCTO AND CART.USER_ID=${userID} AND CART.CART_ACTIVE=1 AND CART_DETAILS.ESTATUS_ITEM=1`
      );
      cost = costquery.rows[0].TOTAL_COST;

      cart = await database.simpleExecute(
        `SELECT CART.CART_ID, CART_DETAILS.DETAIL_ID, CART_DETAILS.COD_PRODUCTO, CART_DETAILS.CANT_PRODUCTO, PRODUCTOS.COD_PRODUCTO, PRODUCTOS.COD_TIENDA, PRODUCTOS.COSTO_PRODUCTO*CART_DETAILS.CANT_PRODUCTO AS TOTALITEM FROM EXOSTO.CART, EXOSTO.CART_DETAILS, EXOSTO.PRODUCTOS WHERE CART.CART_ID=CART_DETAILS.CART_ID AND CART.USER_ID=${userID} AND CART.CART_ACTIVE=1 AND CART_DETAILS.ESTATUS_ITEM=1 AND CART_DETAILS.COD_PRODUCTO=PRODUCTOS.COD_PRODUCTO`
      );
      const cartID = cart.rows[0].CART_ID;

      storeList = await database.simpleExecute(
        `SELECT DISTINCT TIENDAS.COD_TIENDA, TIENDAS.PAYPAL_EMAIL FROM EXOSTO.CART INNER JOIN EXOSTO.CART_DETAILS ON CART.CART_ID=CART_DETAILS.CART_ID INNER JOIN EXOSTO.PRODUCTOS ON CART_DETAILS.COD_PRODUCTO=PRODUCTOS.COD_PRODUCTO INNER JOIN EXOSTO.TIENDAS ON PRODUCTOS.COD_TIENDA=TIENDAS.COD_TIENDA WHERE CART.USER_ID=${userID} AND CART.CART_ACTIVE=1 AND CART_DETAILS.ESTATUS_ITEM=1
        `
      );

      const query = await cartbuilder(cart.rows, "-");
      const hold = await database.simpleExecute(query);

      if (hold.hasOwnProperty("errorNum")) {
        cartFailed = true;
        socket.emit("cartStatus", {
          statusCode: 0,
          message: "some cart item exceeds inventory"
        });
        socket.disconnect();
      } else {
        const holdCart = await database.simpleExecute(
          `CALL EXOSTO.HOLDCART(${cartID})`
        );
        const paysplit = await paypalSplitter(cart.rows, storeList.rows);
    
        socket.emit("cartStatus", {
          statusCode: 1,
          message: "cart is good for purchase",
          cart: cart.rows
        });

        console.log(paysplit)

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
              //console.log(response);
              if (response.status === "COMPLETED") {
                clearInterval(checkpaid);
                const finishCart = await database.simpleExecute(
                  `CALL EXOSTO.FINISHCART(${cartID})`
                );
                const createOrder = await database.simpleExecute(
                  `INSERT INTO EXOSTO.ORDERS (ORDERS.ORDER_ID, ORDERS.CART_ID, ORDERS.TOTAL_PRICE, ORDERS.STATUS, ORDERS.TIME_ORDERED, ORDERS.USER_ID) VALUES(null, ${cartID}, ${paysplit.finalTotal}, 0, CURRENT_TIMESTAMP, ${userID})`
                );
                paymentComplete = true;
                socket.emit("status", {
                  statusCode: 1,
                  message: "successfully purchased"
                });
                socket.disconnect();
              }
            }
          });
        }, 5000);
      }
    });
  } else {
    socket.emit("status", {
      statusCode: 0,
      message: "purchase session expired"
    });
    socket.disconnect();
  }
  setTimeout(function() {
    socket.emit("status", { statusCode: 0, message: "server timed you out" });
    socket.disconnect();
  }, 300000);

  socket.on("disconnect", async () => {
    if (paymentComplete) {
      console.log("payment succeeded and client was closed gracefully");
    } else {
      if (!cartFailed) {
        if (cart !== undefined) {
          clearInterval(checkpaid);
          const queryback = await cartbuilder(cart.rows, "+");
          const resethold = await database.simpleExecute(queryback);
          const unholdCart = await database.simpleExecute(
            `CALL EXOSTO.UNHOLDCART(${cart.rows[0].CART_ID})`
          );
          console.log("resetting", resethold);
        }
      }
    }
    console.log("a user disconnected");
  });
});

if (process.env.NODE_ENV !== "test") {
  server.listen(4000, () => {
    console.log(`Server listening on port 4000`);
  });
}

module.exports = app;
