const userController = require('../controllers/userController')
const taskController = require('../controllers/taskController')
const middleware = require('../middleware/methods')

module.exports = (app) => {

    app.route('/')
        .get(middleware.verifyToken, userController.index)

    app.route('/login')
        .post(userController.checkUser)

    app.route('/info')
        .get(middleware.verifyToken, userController.info)

    app.route('/register')
        .post(userController.store)

    app.route('/task')
        .post(taskController.addTask)

}