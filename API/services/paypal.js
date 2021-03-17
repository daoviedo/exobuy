const Paypal = require('paypal-adaptive');
 
const paypalSdk = new Paypal({
    userId:    'exobuy_api1.outlook.com',
    password:  '43JPMH3JGP2975DE',
    signature: 'AIa5scbnnWsr.lnTtQc.AJUEbdCFAd8JzMAQmyb3qnF4y7cmvkh.HRM1',
    appId: 'ATP7xTn-RywA9EkBQI5F1Nd0bG5NelkT-Gr0VcD-yzCQEurcrZdSi9loAgQpuAKHOGBD-PnaQoM4Tgvi'
});

module.exports = paypalSdk;