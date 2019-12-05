const express = require('express');
const router = express.Router();


router.use('/users', require('./Auth/Auth'));

module.exports = router