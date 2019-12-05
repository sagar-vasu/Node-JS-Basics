const express = require('express');
const app = express();
const mongoose = require('./config/db');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log(`we're connected!`)
});

app.use(express.json());

const PORT = 3001;

app.listen(PORT, () => {
    console.log('port is running');
})




app.use('/', require('./routes'))