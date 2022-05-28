const express = require('express');
const router = require('./routes/search.routes');
const dotenv = require('dotenv');

dotenv.config();

const server = express();

server.use(express.json());

server.use(router);

server.listen(process.env.NODE_PORT, () => console.log('Server is running, listen at port ' + process.env.NODE_PORT));