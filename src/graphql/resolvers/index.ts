import leadResolvers from './leadResolvers';

const resolvers = {
  Query: {
    ...leadResolvers.Query,
  },
  Mutation: {
    ...leadResolvers.Mutation,
  },
};

export default resolvers; 