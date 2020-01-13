const oracledb = require('oracledb');
const dbConfig = require('../config/database.js');

//initialize connection to DB
async function initialize() {
  const pool = await oracledb.createPool(dbConfig.hrPool);
}
module.exports.initialize = initialize;

//Close connection to DB
async function close() {
  await oracledb.getPool().close();
}
module.exports.close = close;

//Function to execute SQL statement
function simpleExecute(statement, binds = [], opts = {}) {
  return new Promise(async (resolve, reject) => {
    let conn;

    opts.outFormat = oracledb.OBJECT;
    opts.autoCommit = true;

    try {
      conn = await oracledb.getConnection();

      const result = await conn.execute(statement, binds, opts);

      resolve(result);
    } catch (err) {
      console.log(err)
      resolve(err);
      //reject(err);
    } finally {
      if (conn) { // conn assignment worked, need to close
        try {
          await conn.close();
        } catch (err) {
          console.log(err);
        }
      }
    }
  });
}

module.exports.simpleExecute = simpleExecute;