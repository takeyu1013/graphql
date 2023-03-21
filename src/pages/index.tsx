import Layout from "../components/Layout";
import { FC, Suspense } from "react";
import { useLazyLoadQuery } from "react-relay";
import { usersQuery } from "queries/__generated__/usersQuery.graphql";
import UsersQuery from "queries/users.query";
import { withRelay } from "relay-nextjs";
import { getClientEnvironment } from "lib/client_environment";

const Home: FC = () => {
  const { users } = useLazyLoadQuery<usersQuery>(UsersQuery, {});

  return (
    <Layout>
      <h1>Users</h1>
      <main>
        <Suspense fallback="Loading...">
          {users.map(({ id, email, name }) => {
            return (
              <div key={id}>
                <p>id: {id}</p>
                <p>name: {name}</p>
                <p>email: {email}</p>
              </div>
            );
          })}
        </Suspense>
      </main>
    </Layout>
  );
};

export default withRelay(Home, UsersQuery, {
  createClientEnvironment: () => getClientEnvironment()!,
  createServerEnvironment: async () => {
    const { createServerEnvironment } = await import(
      "lib/server/relay_server_environment"
    );

    return createServerEnvironment();
  },
});
