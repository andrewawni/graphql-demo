const { getUserID } = require('../utils');

function info() {
    return 'Testing the resolvers';
}

async function fetchTodos(root, args, context, info) {
    
    const clientID = await getUserID(context); 
    let client = await context.prisma.user({
        id: clientID
    });

    if (!client)
        throw new Error('Invalid client');

    return await context.prisma.todoes({
        where: {
            owner: {
                id: clientID
            }
        }
    });
}

async function todo(root, args, context, info) {
    return await context.prisma.todo({ id: args.todoID });
}

module.exports = {
    info,
    fetchTodos,
    todo,
};