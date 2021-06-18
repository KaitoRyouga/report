const response = (status = false, message = "", data = {}) => {

    return {
        status: status,
        body: {
            message: message,
            data: data
        }
    }
}

module.exports = {
    response
}