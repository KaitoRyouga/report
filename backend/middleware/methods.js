const User = require('../models/User')
const jwt = require('jsonwebtoken');
const models = require('../models/Response');
const promisify = require('util').promisify;

const sign = promisify(jwt.sign).bind(jwt);
const verify = promisify(jwt.verify).bind(jwt);

const generateToken = async (payload, secretSignature) => {
    try {
        const jwt = await sign(
            {
                payload,
            },
            secretSignature,
            {
                algorithm: 'HS256'
            },
        );

        return models.response(true, "", { jwt: jwt })

    } catch (error) {
        return models.response(false, error)
    }
}

const verifyToken = async (req, res, next) => {

    const dataTask = req.body.data

    try {

        const jwt = req.headers.authorization.split(" ")[1]
        
        const data = await verify(jwt, "kaito")

        const user = await User.findOne({ username: data.payload.username })

        if (user) {

            const dataTask = user.task
            dataTask.map((d, id) => {
                dataTask[id].id = id + 1
            })

            let temp = {
                username: user.username,
                task: dataTask,
                jwt: jwt
            }

            req.dataMiddware = temp
            req.dataTask = dataTask
            
            next()

        } else {
            res.json(models.response(false, 'token invalid!'))
        }

    } catch (error) {

        res.json(models.response(false, error))

    }
}

module.exports = {
    generateToken,
    verifyToken
}