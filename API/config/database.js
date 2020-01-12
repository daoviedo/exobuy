require('dotenv').config()
//Database connection credentials
module.exports = {
  hrPool: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONN
  }
};