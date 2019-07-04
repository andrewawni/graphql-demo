function owner(parent, args, context) {
    return context.prisma.todo({ id: parent.id }).owner();
}

function tasks(parent, args, context) {
    return context.prisma.todo({id: parent.id}).tasks();
}

module.exports = {
    owner,
    tasks,
}