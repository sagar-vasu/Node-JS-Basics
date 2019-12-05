const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    age: Number
});

const Users = mongoose.model('Users', UsersSchema);

module.exports = Users;