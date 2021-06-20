const User = require('../models/User')
const jwt = require('jsonwebtoken');
const models = require('../models/Response');
const promisify = require('util').promisify;

const verify = promisify(jwt.verify).bind(jwt);

const index = async (req, res) => {

    try {
        const jwt = req.headers.authorization.split(" ")[1]
        const data = await verify(jwt, "kaito")

        if (data.payload.username === "kaito") {
            const user = await User.find({})
            res.json(models.response(true, "All user", {
                user: user
            }))
        } else {
            res.json(models.response(false, 'Not admin'))
        }
    } catch (error) {
        res.json(models.response(false, `Error: ${error}`))
    }
}

module.exports = {
    index
}