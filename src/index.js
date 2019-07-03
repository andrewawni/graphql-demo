const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client')
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const Task = require('./resolvers/Task');
const User = require('./resolvers/User');


const resolvers = {
    Query,
    Mutation,
    User,
    Task,
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: request => {
        return {
          ...request,
          prisma,
        }
      },
})

server.start(() => console.log('server running..'));



//teheheheheh