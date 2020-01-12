const express = require('express');
const cors = require('cors');
const database = require('./services/database.js');
const bodyParser = require('body-parser');

const areaRoutes = require('./controllers/area');

const app = express();

async function startup(){
    try {
        console.log('Initializing database module');
    
        await database.initialize(); 
      } catch (err) {
        console.error(err);
    
        process.exit(1); // Non-zero failure code
      }
      
      // *** existing try block in startup here ***
}
startup();

app.use(cors());
app.use(bodyParser.json());

app.use('/area', areaRoutes);


if(process.env.NODE_ENV !== 'test'){
    app.listen(4000, () => {
        console.log(`Server listening on port 4000`);
    });
}

module.exports = app;