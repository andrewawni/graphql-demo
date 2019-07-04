const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authorize, getUserID, APP_SECRET } = require('../utils');


async function signup(parent, args, context) {

    const password = await bcrypt.hash(args.password, 10);
    const user = await context.prisma.createUser({
        ...args, password
    });
    const token = jwt.sign({ userId: user.id }, APP_SECRET);
    return {
        token,
        user,
    };
}

async function signin(parent, args, context) {

    const user = await context.prisma.user({
        email: args.email
    });

    if (!user) {
        throw new Error('Invalid email');
    }
    const valid = await bcrypt.compare(args.password, user.password);
    if (!valid) {
        throw new Error('Invalid password');
    }
    const token = jwt.sign({ userId: user.id }, APP_SECRET);
    return {
        token,
        user,
    }
}

async function createTodo(root, args, context) {

    const clientID = await getUserID(context); 
    let client = await context.prisma.user({
        id: clientID
    });

    if (!client)
        throw new Error('Invalid client');

    return await context.prisma.createTodo({
        title: args.title,
        owner: { connect: { id: userID } },
    });
}


async function updateTodo(parent, args, context) {

    let targetUser = await context.prisma.todo({
        id: args.todoID
    }).owner();
    await authorize(context, targetUser);

    let todo = {};
    if (args.title)
        todo.title = args.title;

    return await context.prisma.updateTodo({
        data: {
            title: todo.title,
        },
        where: {
            id: args.todoID,
        }
    });
}

async function deleteTodo(parent, args, context) {

    let targetUser = await context.prisma.todo({
        id: args.todoID
    }).owner();

    await authorize(context, targetUser);

    return await context.prisma.deleteTodo({
        id: args.todoID
    });
}

async function createTask(parent, args, context) {

    let targetUser = await context.prisma.todo({
        id: args.todoID
    }).owner();

    await authorize(context, targetUser);

    return await context.prisma.createTask({
        title: args.title,
        description: args.description,
        todo: {
            connect: { id: args.todoID }
        }
    });

}

async function updateTask(parent, args, context) {

    let targetUser = await context.prisma.task({
        id: args.taskID
    }).todo().owner();

    await authorize(context, targetUser);

    let task = await context.prisma.task({
        id: args.taskID
    });

    if (args.title)
        task.title = args.title;
    if (args.description)
        task.description = args.description;
    if (args.isComplete)
        task.isComplete = args.isComplete;

    return await context.prisma.updateTask({
        data: {
            title: task.title,
            description: task.description,
            isComplete: task.isComplete
        },
        where: {
            id: args.taskID
        }
    });

}

async function deleteTask(parent, args, context) {

    let targetUser = await context.prisma.task({
        id: args.taskID
    }).todo().owner();

    await authorize(context, targetUser);

    return await context.prisma.deleteTask({
        id: args.taskID
    });
}


module.exports = {
    createTodo,
    updateTodo,
    deleteTodo,
    signup,
    signin,
    createTask,
    updateTask,
    deleteTask,

}
