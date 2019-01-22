const { prisma } = require("./generated/prisma-client");
const { GraphQLServer } = require("graphql-yoga");

const resolvers = {
  Query: {
    publishedPosts: (_, __, ctx) =>
      ctx.prisma.posts({ where: { published: true } }),

    post: (_, { postId }, ctx) => ctx.prisma.post({ id: postId }),

    postsByUser: (_, { title, userId }, ctx) =>
      ctx.prisma
        .user({
          id: userId
        })
        .posts()
  },
  Mutation: {
    createDraft: (_, { title, userId }, ctx) =>
      ctx.prisma.createPost({
        title,
        author: {
          connect: { id: userId }
        }
      }),

    publish: (_, { postId }, ctx) =>
      ctx.prisma.updatePost({
        where: { id: postId },
        data: { published: true }
      }),

    createUser: (_, { name }, ctx) =>
      ctx.prisma.createUser({
        name
      })
  },
  User: {
    posts: (user, _, ctx) =>
      ctx.prisma
        .user({
          id: user.id
        })
        .posts()
  },
  Post: {
    author: (post, _, ctx) =>
      ctx.prisma
        .post({
          id: post.id
        })
        .author()
  }
};

const server = new GraphQLServer({
  typeDefs: "./schema.graphql",
  resolvers,
  context: {
    prisma
  }
});

server.start(() => console.log(`Server is running on http://localhost:4000`));
