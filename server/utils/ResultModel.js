/**
 * @description result state model
 */

class BaseModel {
    constructor(data, msg) {
        if (typeof data === 'string') {
            this.msg = data
            data = null
            msg = null
        }

        if (data) {
            this.data = data
        }

        if (msg) {
            this.msg = msg
        }
    }
}

// Successful Model
class SuccessfulModel extends BaseModel {
    constructor(data, msg) {
        super(data, msg)
        this.code = 0
    }
}

class ErrorModel extends BaseModel {
    constructor(data, msg) {
        super(data, msg)
        this.code = 1
    }
}

module.exports = {
    SuccessfulModel,
    ErrorModel
}