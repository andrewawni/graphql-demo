function info() {

    return 'Testing';
}

function feed(root, args, context, info) {
    return context.prisma.links();
}

function link(root, args, context, info) {
    return context.prisma.link({ id: args.id });
}

module.exports = { info, feed, link};