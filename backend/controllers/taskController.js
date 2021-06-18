const User = require('../models/User')
const jwt = require('jsonwebtoken');
const models = require('../models/Response');
const promisify = require('util').promisify;

const verify = promisify(jwt.verify).bind(jwt);

const addTask = async (req, res) => {

    const dataTask = req.body

    try {

        const jwt = req.headers.authorization.split(" ")[1]

        const data = await verify(jwt, "kaito")

        const user = await User.findOne({ username: data.payload.username })

        if (user) {

            dataTask.map((d, id) => {
                dataTask[id].id = id
            })

            const temp = {
                username: user.username,
                password: user.password,
                _id: user._id,
                task: dataTask
            }

            await User.updateOne({username: user.username}, temp)
            res.json(models.response(true, 'Update success!'))

        } else {
            res.json(models.response(false, 'token invalid!'))
        }

    } catch (error) {

        res.json(models.response(false, error))

    }
}

module.exports = {
    addTask
}