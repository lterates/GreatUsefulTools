const express = require('express');
const router = express.Router()
const User = require('../models/users.js')

//GET All Tools
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err){
        res.status(500).json({message: err.message})
    }
})

//GET One User
router.get('/:id', getUser, (req, res) => {
    res.json(res.user);
})

//POST (Create)One User
router.post('/', async (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        teacher: req.body.teacher,
    })

    try {
        const newUser = await user.save()
        res.status(201).json('Sucessfully created new user: ' + newUser.username);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

async function getUser (req, res, next) {
    let user;
    try {
        user = await User.findById(req.params.id)
        if (user == null){
            return res.status(404).json({message: 'Cannot find user'})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
    res.user = user;
    next();
}

module.exports = router;