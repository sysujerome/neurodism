const express = require('express');

let app = express();

const neurodism = require('./api');
app.use('/neurodism', express.static('../client'));
app.use('/neurodism', neurodism);

app.listen(8070);
console.log('neurodism server started');

 