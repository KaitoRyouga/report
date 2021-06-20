const express = require('express')
const mongoose = require('mongoose')
const routes = require('./routes/routes')
bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv');

dotenv.config();
const port = process.env.PORT_DEV || 3001;

const app = express()
app.use(cors())
app.listen(port)
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster-learn.ysvwg.mongodb.net/${process.env.DB_NAME}`, {useNewUrlParser: true, useUnifiedTopology: true});

routes(app)