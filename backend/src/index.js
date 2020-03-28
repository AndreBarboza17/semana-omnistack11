const express = require('express')

const routes = require('./routes');

const cors = require('cors');

const app = express();

// libera a aplicação para qualquer host acessar
app.use(cors());

app.use(express.json());

app.use(routes);

app.listen('3333');