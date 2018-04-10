const express = require('express');
const router = require('router');
const User = require('./user.js');

const app = express();

app.use(require('./routes'));

app.listen(3000,()=>{
    console.log(`app is running on port 3000`);
})