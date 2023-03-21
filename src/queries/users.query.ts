import { graphql } from "react-relay";

const UsersQuery = graphql`
  query usersQuery {
    users {
      id
      name
      email
    }
  }
`;

export default UsersQuery;
