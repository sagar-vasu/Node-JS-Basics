const express = require('express');
const router = express.Router();
const Users = require('../../models/Register')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');




// Getting Users from MongoDB 

router.get('/getAll', async (req, res) => {
    try {
        const users = await Users.find({});
        res.send(users)
    }
    catch (err) {
        res.status(400).send({ message: err.message })
    }

})


// Add New User

router.post('/addUser', async (req, res) => {
    try {
        const user = new Users(req.body);
        await user.save();
        res.send({ message: "User successfully inserted!" })
    } catch (e) {
        res.send(500, { message: e.message })
    }

})

// Create A New User

router.post('/register', async (req, res) => {
    const user = req.body
    const emailExist = await Users.findOne({ email: user.email })
    if (emailExist) {
        return res.status(400).send({ message: 'Email Already exists' })
    }

    try {
        const hash = hashPassword(user.password);
        user.password = hash
        const newUser = new Users(user)
        newUser.save()
        res.send({ message: "User registered successfully!" })

    }
    catch (err) {
        res.send(500, { message: e.message })
    }

})



// Login User

router.post('/login', async (req, res) => {
    const user = await Users.find({ email: req.body.email })
    if (!user.length) {
        res.send(500, { message: "User not found!" });
        return;
    }
    const passwordMatched = bcrypt.compareSync(req.body.password, user[0].password);

    if (!passwordMatched) {
        res.send(500, { message: "Incorrect Email/Password!" });
        return;
    }


    //Generate Token
    const token = jwt.sign({ user: user[0] }, 'yourSecretKey');

    res.send({
        email: user.email,
        password: user.password,
        name: user.name,
        age: user.age,
        userToken: token
    })

})



// Update User

router.put("/update", async (req, res) => {
    try {
        const user = await Users.findOneAndUpdate({ email: req.body.oldEmail }, req.body)
        res.send({
            message: "user Updated"
        })
    }
    catch (e) {
        res.send(500, { message: e.message })

    }

})


// Delete User 

router.delete('/remove', async (req, res) => {
    const user = await Users.find({ email: req.body.email })
    if (!user.length) {
        res.send(500, { message: "User not found!" });
        return;
    }

    try {
        const delUser = await Users.deleteOne({ email: req.body.email })
        res.send({ message: 'user Deleted Successflly !' })
    }
    catch (err) {
        res.send(500, { message: err.message });
    }


})





function hashPassword(password) {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    return hash;
}







module.exports = router