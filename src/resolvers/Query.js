const { getUserId, APP_SECRET } = require('../utils');

function info() {

    return 'Testing';
}

function feed(root, args, context, info) {
    const userID = getUserId(context);
    return context.prisma.todos({
        where: {
            owner: {
                id: userID
            }
        }
    });
}

function todo(root, args, context, info) {
    return context.prisma.todo({ id: args.id });
}

module.exports = {
    info,
    feed,
    todo,
};