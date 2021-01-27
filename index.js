const express = require('express');
require('dotenv').config();
const app = express();
const {dbConnection} = require('./database/config');
const cors = require('cors');

//DB
dbConnection();

//cors
app.use(cors());

// public directory
app.use(express.static('public'));

//lectura y parseo del body
app.use(express.json());

//Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

//Init note
app.listen(process.env.PORT, ()=>{
   console.log(`Server in port = ${process.env.PORT}`);
})
