function todo(parent, args, context) {
    return context.prisma.task({ id: parent.id }).todo();
}

module.exports = {
    todo,
}