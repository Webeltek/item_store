const gql = String.raw;

export default gql`

  type UserState {
    isLogged: Boolean!
  }

  type Query {
    url(routeId: String!, assetType: String!): String!,
    userState: UserState!
  }`;