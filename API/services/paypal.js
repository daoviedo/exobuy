var Paypal = require('paypal-adaptive');
 
var paypalSdk = new Paypal({
    userId:    'sb-oao8o1211844_api1.business.example.com',
    password:  'YR6AWXB9GU3ZK6R6',
    signature: 'AxBuN-ZTRymyWzg-3SL61oX1RJBNATOpH13xg-Ta2pXTfzdesMZlDkS8',
    appId: "APP-80W284485P519543T",
    sandbox:   true //defaults to false
});

module.exports = paypalSdk;