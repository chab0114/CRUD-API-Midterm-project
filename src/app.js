const express = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Movie Tracker API is running');
} );

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});