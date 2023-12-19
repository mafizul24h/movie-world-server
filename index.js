const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())


app.get('/', (req, res) => {
    res.send('Movie Server Running')
})

app.listen(port, () => {
    console.log(`Movie Server is Ruuning Port ${5000}`);
})