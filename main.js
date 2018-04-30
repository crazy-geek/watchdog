const express = require('express');
const bodyParser = require('body-parser');
const morgan =  require('morgan');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/bolderAuthentication');

const app = express();

//# middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());

//app.use(require('./routes'));

//# routes
app.use('/user', require('./routes/users'))

//# server start
const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`app is running on port ${port}`);
})