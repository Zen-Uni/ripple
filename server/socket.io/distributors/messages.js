const { gainIo } = require('../')

const distributeUserMessage = (user, msg) => {
    gainIo()
        .to('user:' + user)
        .emit('post-message:user', msg)
}

const distributeGroupMessage = (group, msg) => {
    gainIo()
        .to('group:' + group)
        .emit('post-message:group', msg)
}

const distributeReadUserMessages = (user, msgIds) => {
    gainIo()
        .to('user:' + user)
        .emit('read-message:user', msgIds)
}

const distributeReadGroupMessages = (group, msgIds) => {
    gainIo()
        .to('group:' + group)
        .emit('read-message:group', msgIds)
}

const distributeRecallUserMessages = (user, msgIds) => {
    gainIo()
        .to('user:' + user)
        .emit('recall-message:user', msgIds)
}

const distributeRecallGroupMessages = (group, msgIds) => {
    gainIo()
        .to('group:' + group)
        .emit('recall-message:group', msgIds)
}

module.exports = {
    distributeUserMessage,
    distributeGroupMessage,
    distributeReadUserMessages,
    distributeReadGroupMessages,
    distributeRecallUserMessages,
    distributeRecallGroupMessages,
}
