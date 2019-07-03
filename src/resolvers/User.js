function todos(parent, args, context) {
    return context.prisma.user({ id: parent.id }).todos();
}

module.exports = {
    todos,
}