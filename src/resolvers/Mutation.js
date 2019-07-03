const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUserId, APP_SECRET } = require('../utils');

async function createTodo(root, args, context) {
    const userID = getUserId(context);
    
    return await context.prisma.createTodo({
        title: args.title,
        owner: { connect: { id: userID } },
    });
}

function updateTodo(parent, args, context) {
    let todo = {};
    if (args.title)
        todo.title = args.title;
    
    return context.prisma.updateTodo({
        data: {
            title: todo.title,
        },
        where: {
            id: args.id
        }
    });
}

async function deleteTodo(parent, args, context) {
    const deletedTodo = await context.prisma.deleteTodo({ id: args.id });
    return deletedTodo;
}

async function signup(parent, args, context) {

    const password = await bcrypt.hash(args.password, 10)
    const user = await context.prisma.createUser({ ...args, password })
    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    return {
        token,
        user,
    }
}

async function signin(parent, args, context) {
    const user = await context.prisma.user({ email: args.email })
    if (!user) {
        throw new Error('No such user found')
    }
    const valid = await bcrypt.compare(args.password, user.password)
    if (!valid) {
        throw new Error('Invalid password')
    }
    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    return {
        token,
        user,
    }
}


module.exports = {
    createTodo,
    updateTodo,
    deleteTodo,
    signup,
    signin,
}


