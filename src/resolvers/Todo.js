function owner(parent, args, context) {
    return context.prisma.todo({ id: parent.id }).owner();
}

module.exports = {
    owner,
}