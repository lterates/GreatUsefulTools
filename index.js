const express = require('express');
const cors = require ('cors');
const mongoose = require ('mongoose')
require('dotenv').config();

const app = express();
const port =  3000;
const host = '127.0.0.1';

//Connection to a mongoDB database
mongoose.connect(process.env.DATABASE_URL, {useUnifiedTopology: true, useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Server Started")
});

//Enable parsing JSON body data
app.use(express.json());

//app.use(express.static("views"))

//Serving the home page in an html file
app.get('/', (req, res) => {
    res.send('Welcome home')
})

const toolsRouter = require ('./routes/tools.js')
app.use('/tools', toolsRouter)

//App Listening log
app.listen(port, host, () => console.log(`App is listening at http://${host}:${port}/`));