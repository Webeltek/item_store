const gql = String.raw;

export default gql`

  type Query {
    url(routeId: String!, assetType: String!): String!,
  }`;