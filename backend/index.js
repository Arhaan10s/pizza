const express = require('express');
const cors = require('cors');
const { readdirSync } = require('fs');
require('dotenv').config();
const seq = require('./connection/db')
// const Synchronize = require('./Models/Synchronize');


const app = express();
const port  = 3000;

app.use(cors());
app.use(express.json());

readdirSync('./Routes').map((route)=> app.use('/api',require('./Routes/' + route)));

app.listen(port, () => console.log(`Listening on ${port}`));