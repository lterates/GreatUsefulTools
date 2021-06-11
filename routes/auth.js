const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');
const bodyParser = require ('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const { check, validationResult } = require ('express-validator')
const bcrypt = require('bcryptjs')
const User = require('../models/users.js')

//MAIN AUTH PAGE
router.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/views/auth.html')
})

//REGISTER NEW USER ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
router.post('/register', urlencodedParser, [check('email').isEmail().normalizeEmail()] ,async (req, res) => {
    //express-validator
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(422).send('O Email Introduzido não é válido. Tente de novo')
    }
    //Checking the checkbox value before submitting
    if(req.body.teacher == "on") {
        req.body.teacher = true;
    } else {
        req.body.teacher = false;
    }
    //Checking if user already exists
    const emailExists = await User.findOne({email: req.body.email});
    const usernameExists = await User.findOne({username: req.body.username});
    if (emailExists) return res.status(400).send('Email already in use')
    if (usernameExists) return res.status(400).send('Username already registered. Try another One')
    //Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Creating new user in the database
    const user = new User({
         username: req.body.username,
         email: req.body.email,
         password: hashedPassword,
         teacher: req.body.teacher,
    })
    try {
        const newUser = await user.save()
        res.status(201).json('Sucessfully created new user: ' + newUser.username);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

//LOGIN~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
router.post('/login', urlencodedParser, async (req, res) => {
    const user = await User.findOne({username: req.body.username});
    if (!user) return res.status(400).send('Username is incorrect')

    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(400).send('Password is incorrect')
    
    //Generate token
    const token = jwt.sign({_id: user._id}, process.env.SECRET)
    res.header('auth-token', token).send(token)
    //redirect('/menu' + "?" + "auth-token=" + token);
});

module.exports = router;