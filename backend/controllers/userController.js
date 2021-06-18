const User = require('../models/User')
const models = require('../models/Response')
const middleware = require('../middleware/methods')

const index = (req, res) => {
    res.json({ message: "hello CC" })
}

const store = async (req, res) => {

    try {

        const user = req.body.username
        const pass = req.body.password

        if (user !== "" && user !== undefined && user !== null && pass !== "" && pass !== undefined && pass !== null) {

            const userTemp = new User({
                username: user,
                password: pass,
                task: []
            })

            userTemp.save()

            const jwt = await middleware.generateToken({ username: user }, "kaito")

            if (jwt.status) {
                res.json(models.response(true, "Register success!", jwt.body.data))
            } else {
                res.json(models.response(false, "Register fail!"))
            }

        } else {
            res.json(models.response(false, "Register fail!"))
        }

    } catch (error) {
        res.json(models.response(false, "Register fail!"))
    }

}

const checkUser = async (req, res) => {

    try {

        const user = await User.findOne({ username: req.body.username })

        if (user) {

            const result = await middleware.generateToken({ username: user.username }, "kaito")
            const jwt = result.body.data.jwt

            let temp = {
                username: user.username,
                jwt: jwt
            }

            res.json(models.response(true, "Login success!", temp))
        } else {
            res.json(models.response(false, "Invalid username/password!"))
        }

    } catch (error) {

        res.json(models.response(false, `Error: ${error}`))
    }


}

const info = async (req, res) => {

    try {
        res.json(models.response(true, "", req.dataMiddware))
    } catch (error) {
        res.json(models.response(false, "Error!"))
    }

}

module.exports = {
    index,
    store,
    checkUser,
    info
}