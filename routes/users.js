const express = require('express');
const router = express.Router()
const User = require('../models/users.js')
const verify = require ('./verifyToken.js')

//GET All Users
router.get('/', verify, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err){
        res.status(500).json({message: err.message})
    }
})

//GET One User
router.get('/:id', verify, getUser, (req, res) => {
    res.json(res.user);
})

//DELETE One User
router.delete('/:id', verify, getUser, async (req, res) => {
    try {
        await res.user.remove()
        res.json({message: 'Deleted User'})
    } catch (err) {
        res.status(500).json({message: err.message})
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