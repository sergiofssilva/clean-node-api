import resolvers from '@/main/graphql/resolvers'
import typeDefs from '@/main/graphql/type-defs'
import { ApolloServer } from 'apollo-server-express'

export const setupApolloServer = (): ApolloServer => new ApolloServer({
  resolvers,
  typeDefs
})
