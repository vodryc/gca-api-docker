const express = require('express');
const cors = require('cors');
const rasterRouter = require('./routers/raster');

const port = 3001;

const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// Register routers
app.use(rasterRouter);

app.listen(port, () => console.log(`GCA API listening at http://localhost:${port}`));