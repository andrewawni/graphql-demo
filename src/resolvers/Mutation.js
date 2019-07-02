const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUserId, APP_SECRET } = require('../utils');

function post(root, args, context) {
    const userID = getUserId(context);
    return context.prisma.createLink({
        url: args.url,
        description: args.description,
        postedBy: { connect: { id: userID } },
    });
}

function updateLink(parent, args, context) {
    let link = {};
    if (args.description)
        link.description = args.description;
    if (args.url)
        link.url = args.url;

    return context.prisma.updateLink({
        data: {
            description: link.description,
            url: link.url
        },
        where: {
            id: args.id
        }
    });
}

function deleteLink(parent, args, context) {
    let del = context.prisma.deleteLink({ id: args.id });
    return del;
}

// signup(name: String!, email: String!, password: String!):AuthPayLoad

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
    post,
    updateLink,
    deleteLink,
    signup,
    signin,
}


